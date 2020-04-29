import { _decorator, Component, ITriggerEvent, ColliderComponent, LabelComponent, VerticalTextAlignment, UITransformComponent, Color, Size } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("triggertesting")
@menu("physics/triggertesting")
export class triggertesting extends Component {

    private static _idCounter = 0;
    public readonly id: number;

    private _prev: Boolean[] = [];

    @property({ type: LabelComponent })
    public label: LabelComponent = null;

    constructor () {
        super();
        this.id = triggertesting._idCounter++;
    }

    start () {
        // Your initialization goes here.
        let trigger = this.getComponent(ColliderComponent);
        if (trigger) {
            trigger.on('onTriggerEnter', this.onTrigger, this);
            trigger.on('onTriggerStay', this.onTrigger, this);
            trigger.on('onTriggerExit', this.onTrigger, this);
        }
    }

    onTrigger (event: ITriggerEvent) {
        const collider = this.getComponent(ColliderComponent);
        if (collider != event.selfCollider) {
            this.label.string = "[错误]：self不等于自己，请提交 issue";
            this.label.fontSize = 40;
            this.label.lineHeight = 40;
            this.label.verticalAlign = VerticalTextAlignment.CENTER;
            this.label.getComponent(UITransformComponent).contentSize = new Size(400, 400);
            this.label.color = Color.RED;
            this.enabled = false;
            return;
        }
        if (event.type == 'onTriggerStay') {
            if (!this._prev[event.otherCollider._id]) {
                this._prev[event.otherCollider._id] = true;
            } else {
                return;
            }
        } else if (event.type == 'onTriggerExit') {
            this._prev[event.otherCollider._id] = false;
        }

        if (this.label) {
            this.label.string += event.selfCollider.node.name + '__' + event.type + '__' + event.otherCollider.node.name + ' ';
        }
    }

    fill () {

    }
}
