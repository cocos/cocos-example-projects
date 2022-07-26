import { _decorator, Component, Node, Material, input, Input, EventTouch, CameraComponent, geometry, Touch, PhysicsSystem, ModelComponent, Toggle, LabelComponent, EditBox, Button } from "cc";
const { ccclass, property, menu } = _decorator;

enum ERaycastType {
    ALL,
    CLOSEST
}

@ccclass("CASES.RaycastTest")
@menu("cases/RaycastTest")
export class RaycastTest extends Component {

    @property({ type: Material })
    readonly defaultMaterial: Material = null as any;

    @property({ type: Material })
    readonly rayMaterial: Material = null as any;

    @property({ type: CameraComponent })
    readonly camera: CameraComponent = null as any;

    @property({ type: LabelComponent })
    readonly label: LabelComponent = null as any;

    @property({ type: PhysicsSystem.PhysicsGroup })
    ingnoreLayer: number = 0;

    @property
    queryTrigger = true;

    private _raycastType: ERaycastType = ERaycastType.ALL;
    private _ray: geometry.Ray = new geometry.Ray();
    private _maxDistance: number = 100;
    private _mask: number = 0xffffffff;

    public set maxDistance(v: number) {
        this._maxDistance = v;
        this.label.string = '当前检测距离：' + this._maxDistance.toString();
    }

    start() {
        this.maxDistance = this._maxDistance;
        this._mask &= ~this.ingnoreLayer;
    }

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(touch: Touch, event: EventTouch) {
        this.resetAll();

        this.camera.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
        switch (this._raycastType) {
            case ERaycastType.ALL:
                if (PhysicsSystem.instance.raycast(this._ray, this._mask, this._maxDistance, this.queryTrigger)) {
                    const r = PhysicsSystem.instance.raycastResults;
                    for (let i = 0; i < r.length; i++) {
                        const item = r[i];
                        const modelCom = item.collider.node.getComponent(ModelComponent)!;
                        modelCom.material = this.rayMaterial;
                    }
                }
                break;
            case ERaycastType.CLOSEST:
                if (PhysicsSystem.instance.raycastClosest(this._ray, this._mask, this._maxDistance, this.queryTrigger)) {
                    const r = PhysicsSystem.instance.raycastClosestResult;
                    const modelCom = r.collider.node.getComponent(ModelComponent)!;
                    modelCom.material = this.rayMaterial;
                }
                break;
        }
    }

    resetAll() {
        for (let i = 0; i < this.node.children.length; i++) {
            let modelCom = this.node.children[i].getComponent(ModelComponent)!;
            modelCom.material = this.defaultMaterial;
        }
    }

    onToggle(toggleCom: Toggle) {
        if (toggleCom.node.name == 'Toggle1') {
            this._raycastType = ERaycastType.ALL;
        } else if (toggleCom.node.name == 'Toggle2') {
            this._raycastType = ERaycastType.CLOSEST;
        }
    }

    onClickQueryTrigger(toggle: Toggle) {
        this.queryTrigger = toggle.isChecked;
    }

    onEditFinish(editBox: EditBox) {
        const v = parseFloat(editBox.string);
        if (!isNaN(v)) {
            this.maxDistance = v;
        }
    }

    onMaskBtn(event: EventTouch) {
        const lb = (event.target as Node).getComponentInChildren(LabelComponent)!;
        if (this._mask != 0) {
            this._mask = 0;
            lb.string = "检测状态：off";
        } else {
            this._mask = 0xffffffff & ~this.ingnoreLayer;
            lb.string = "检测状态：on";
        }
    }

}
