import { _decorator, Component, CameraComponent, Vec3, Quat, Node } from "cc";
const { ccclass, property, menu } = _decorator;

const _v3_0 = new Vec3();

@ccclass("RALL-A-BALL.coordinate-ui-3d")
@menu("demo/roll-a-ball/coordinate-ui-3d")
export class CoordinateUi3D extends Component {

    @property({ type: Node })
    public D3Node: Node = null;

    @property({ type: Node })
    public UINode: Node = null;

    @property({ type: CameraComponent })
    public mainCamera: CameraComponent = null;

    lateUpdate (deltaTime: number) {
        this.D3Node.getWorldPosition(_v3_0);
        _v3_0.y += 1.5;
        this.mainCamera.convertToUINode(_v3_0, this.UINode.parent, _v3_0);
        this.UINode.setPosition(_v3_0);
    }
}

