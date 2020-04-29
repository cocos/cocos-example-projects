import { _decorator, Component, Node, Vec3, director, Director, easing, math, Quat, Mat4 } from "cc";
const { ccclass, property } = _decorator;

const v3_0 = new Vec3();
const _pos = new Vec3();
const _look = new Vec3();

@ccclass("CameraFollow")
export class CameraFollow extends Component {

    @property({ type: Node })
    lookTarget: Node = null;

    @property({ type: Vec3 })
    offset: Vec3 = new Vec3();

    @property
    epsilon: number = 0.001;

    start () {
        director.on(Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
    }

    beforeDraw () {
        const eulerY = this.lookTarget.eulerAngles.y;
        const _quat = Quat.fromEuler(new Quat(), 0, eulerY, 0);
        const _mat4 = Mat4.fromRT(new Mat4(), _quat, this.lookTarget.worldPosition);
        v3_0.set(this.offset);
        v3_0.transformMat4(_mat4);
        _pos.lerp(v3_0, 0.2);
        this.node.worldPosition = _pos;

        v3_0.set(this.lookTarget.worldPosition);
        _look.lerp(v3_0, 0.2);
        this.node.lookAt(_look);
    }
}
