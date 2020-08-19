import { _decorator, Component, Vec3, Quat, Node } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("CASES.LoopMotion")
@menu("cases/LoopMotion")
export class LoopMotion extends Component {

    @property
    readonly USE_TRANSLATE = false;

    @property({ visible: function (this: LoopMotion) { return this.USE_TRANSLATE } })
    readonly deltaMotion = new Vec3();

    @property({ visible: function (this: LoopMotion) { return this.USE_TRANSLATE } })
    readonly USE_LOOP = false;

    @property({ visible: function (this: LoopMotion) { return this.USE_TRANSLATE && this.USE_LOOP } })
    readonly displacement = new Vec3();

    @property
    readonly USE_ROTATION = false;

    @property({ visible: function (this: LoopMotion) { return this.USE_ROTATION } })
    readonly deltaEuler = new Vec3();

    @property
    readonly USE_SCALE = false;

    @property({ visible: function (this: LoopMotion) { return this.USE_SCALE } })
    readonly deltaScale = new Vec3();

    @property({ visible: function (this: LoopMotion) { return this.USE_SCALE } })
    readonly USE_LOOP_SCALE = false;

    @property({ visible: function (this: LoopMotion) { return this.USE_SCALE && this.USE_LOOP_SCALE } })
    readonly scaleLength = new Vec3();

    private readonly _origin = new Vec3();
    private readonly _rot = new Quat();
    private readonly _scale = new Vec3();

    start () {
        Quat.fromEuler(this._rot, this.deltaEuler.x, this.deltaEuler.y, this.deltaEuler.z);
        Vec3.copy(this._origin, this.node.worldPosition);
        Vec3.copy(this._scale, this.node.worldScale);
    }

    update (deltaTime: number) {
        if (this.USE_TRANSLATE) {
            if (this.USE_LOOP) {
                const posNow = this.node.worldPosition;
                if (Math.abs(posNow.x - this._origin.x) > this.displacement.x) this.deltaMotion.x *= -1;
                if (Math.abs(posNow.y - this._origin.y) > this.displacement.y) this.deltaMotion.y *= -1;
                if (Math.abs(posNow.z - this._origin.z) > this.displacement.z) this.deltaMotion.z *= -1;
            }
            this.node.translate(this.deltaMotion, Node.NodeSpace.WORLD);
        }

        if (this.USE_SCALE) {
            const ws = this.node.worldScale;
            if (this.USE_LOOP_SCALE) {
                if (Math.abs(ws.x - this._scale.x) > this.scaleLength.x) this.deltaScale.x *= -1;
                if (Math.abs(ws.y - this._scale.y) > this.scaleLength.y) this.deltaScale.y *= -1;
                if (Math.abs(ws.z - this._scale.z) > this.scaleLength.z) this.deltaScale.z *= -1;
            }

            this.node.setWorldScale(ws.x + this.deltaScale.x, ws.y + this.deltaScale.y, ws.z + this.deltaScale.z);
        }

        if (this.USE_ROTATION) {
            this.node.rotate(this._rot, Node.NodeSpace.WORLD);
        }
    }
}
