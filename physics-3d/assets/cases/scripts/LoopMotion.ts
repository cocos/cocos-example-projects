import { _decorator, Component, Vec3, Quat } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("LoopMotion")
@menu("physics/LoopMotion")
export class LoopMotion extends Component {

    @property
    public deltaMotion: Vec3 = new Vec3;

    @property
    public readonly maxPostion: Vec3 = new Vec3;

    @property
    public readonly deltaRot: Quat = new Quat();

    update (deltaTime: number) {

        const posNow = this.node.worldPosition;
        if (posNow.x > this.maxPostion.x || posNow.x < -this.maxPostion.x) {
            this.deltaMotion.x = -this.deltaMotion.x;
        }

        if (posNow.y > this.maxPostion.y || posNow.y < -this.maxPostion.y) {
            this.deltaMotion.y = -this.deltaMotion.y;
        }

        if (posNow.z > this.maxPostion.z || posNow.z < -this.maxPostion.z) {
            this.deltaMotion.z = -this.deltaMotion.z;
        }

        const newPos = this.deltaMotion.clone();
        newPos.add(this.node.worldPosition);
        this.node.setWorldPosition(newPos);

        if (!this.deltaRot.equals(Quat.IDENTITY)) {
            this.node.rotate(this.deltaRot);
        }
    }
}
