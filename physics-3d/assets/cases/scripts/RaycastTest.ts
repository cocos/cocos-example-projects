import { _decorator, Component, Node, Material, systemEvent, SystemEventType, EventTouch, CameraComponent, geometry, Touch, PhysicsSystem, Layers, ModelComponent, ToggleComponent, LabelComponent, EditBoxComponent } from "cc";
const { ccclass, property, menu } = _decorator;

enum ERaycastType {
    ALL,
    CLOSEST
}

@ccclass("RaycastTest")
@menu("physics/grouptesting")
export class RaycastTest extends Component {

    @property({ type: Material })
    readonly defaultMaterial: Material = null;

    @property({ type: Material })
    readonly rayMaterial: Material = null;

    @property({ type: CameraComponent })
    readonly camera: CameraComponent = null;

    @property({ type: LabelComponent })
    readonly label: LabelComponent = null;

    private _raycastType: ERaycastType = ERaycastType.ALL;
    private _ray: geometry.ray = new geometry.ray();
    private _maxDistance: number = 100;
    private _mask: number = 0xffffffff;

    public set maxDistance (v: number) {
        this._maxDistance = v;
        this.label.string = '当前检测距离：' + this._maxDistance.toString();
    }

    start () {
        this.maxDistance = this._maxDistance;
    }

    onEnable () {
        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable () {
        systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart (touch: Touch, event: EventTouch) {
        this.resetAll();

        this.camera.screenPointToRay(touch._point.x, touch._point.y, this._ray);
        switch (this._raycastType) {
            case ERaycastType.ALL:
                if (PhysicsSystem.instance.raycast(this._ray, this._mask, this._maxDistance)) {
                    const r = PhysicsSystem.instance.raycastResults;
                    for (let i = 0; i < r.length; i++) {
                        const item = r[i];
                        const modelCom = item.collider.node.getComponent(ModelComponent);
                        modelCom.material = this.rayMaterial;
                    }
                }
                break;
            case ERaycastType.CLOSEST:
                if (PhysicsSystem.instance.raycastClosest(this._ray, this._mask, this._maxDistance)) {
                    const r = PhysicsSystem.instance.raycastClosestResult;
                    const modelCom = r.collider.node.getComponent(ModelComponent);
                    modelCom.material = this.rayMaterial;
                }
                break;
        }
    }

    resetAll () {
        for (let i = 0; i < this.node.children.length; i++) {
            let modelCom = this.node.children[i].getComponent(ModelComponent);
            modelCom.material = this.defaultMaterial;
        }
    }

    onToggle (toggleCom: ToggleComponent) {
        if (toggleCom.node.name == 'Toggle1') {
            this._raycastType = ERaycastType.ALL;
        } else if (toggleCom.node.name == 'Toggle2') {
            this._raycastType = ERaycastType.CLOSEST;
        }
    }

    onEditFinish (editBox: EditBoxComponent) {
        const v = parseFloat(editBox.string);
        if (!isNaN(v)) {
            this.maxDistance = v;
        }
    }

    onMaskBtn (event: EventTouch) {
        const lb = (event.target as Node).getComponentInChildren(LabelComponent);
        if (this._mask == 0xffffffff) {
            this._mask = 0;
            lb.string = "检测状态：off";
        } else {
            this._mask = 0xffffffff;
            lb.string = "检测状态：on";
        }
    }

}
