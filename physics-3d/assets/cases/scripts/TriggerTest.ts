import { _decorator, Component, Node, Quat, ITriggerEvent, Material, ColliderComponent, ModelComponent, LabelComponent, VerticalTextAlignment, UITransform, Size, Color } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("CASES.TriggerTest")
@menu("cases/TriggerTest")
export class TriggerTest extends Component {

    @property
    USE_MATERIAL = true;

    @property({ type: Material, visible: function (this: TriggerTest) { return this.USE_MATERIAL; } })
    enterMat: Material = null as any;

    @property({ type: Material, visible: function (this: TriggerTest) { return this.USE_MATERIAL; } })
    exitMat: Material = null as any;

    @property
    USE_LABEL = false;

    @property({ type: LabelComponent, visible: function (this: TriggerTest) { return this.USE_LABEL; } })
    label: LabelComponent = null as any;

    private _prev: Boolean[] = [];
    private _amount: number = 0;

    start () {
        const collider = this.getComponent(ColliderComponent);
        if (collider) {
            if (this.USE_MATERIAL) {
                collider.on('onTriggerEnter', this.onTriggerForUseMaterial, this);
                collider.on('onTriggerStay', this.onTriggerForUseMaterial, this);
                collider.on('onTriggerExit', this.onTriggerForUseMaterial, this);
            }
            if (this.USE_LABEL) {
                collider.on('onTriggerEnter', this.onTriggerForUseLabel, this);
                collider.on('onTriggerStay', this.onTriggerForUseLabel, this);
                collider.on('onTriggerExit', this.onTriggerForUseLabel, this);
            }
        }
    }

    onTriggerForUseMaterial (event: ITriggerEvent) {
        if (event.type == 'onTriggerEnter') {
            const modelCom = event.otherCollider.node.getComponent(ModelComponent);
            if (modelCom) {
                modelCom.material = this.enterMat;
            }
        } else if (event.type == 'onTriggerExit') {
            const modelCom = event.otherCollider.node.getComponent(ModelComponent);
            if (modelCom) {
                modelCom.material = this.exitMat;
            }
        }
    }

    onTriggerForUseLabel (event: ITriggerEvent) {
        const collider = this.getComponent(ColliderComponent);
        if (collider != event.selfCollider) {
            this.label.string = "[错误]：self不等于自己，请提交 issue";
            this.label.fontSize = 40;
            this.label.lineHeight = 40;
            this.label.verticalAlign = VerticalTextAlignment.CENTER;
            this.label.getComponent(UITransform)!.contentSize = new Size(400, 400);
            this.label.color = Color.RED;
            this.enabled = false;
            return;
        }
        if (event.type == 'onTriggerStay') {
            if (!this._prev[event.otherCollider.uuid]) {
                this._prev[event.otherCollider.uuid] = true;
            } else {
                return;
            }
        } else if (event.type == 'onTriggerExit') {
            this._prev[event.otherCollider.uuid] = false;
        }

        if (this.label) {
            if (this._amount++ > 11) { this.label.string = ''; this._amount = 0; }
            this.label.string += event.selfCollider.node.name + '__' + event.type + '__' + event.otherCollider.node.name + '\n';
        }
    }
}
