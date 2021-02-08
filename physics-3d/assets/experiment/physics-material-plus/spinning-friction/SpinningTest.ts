import { _decorator, Component, Node, RigidBodyComponent, Vec3 } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('PHY-MTL-PLUS.SpinningTest')
@menu("experiment/physics-material-plus/SpinningTest")
export class SpinningTest extends Component {

    @property
    interval = 2; // second

    @property
    torque = 40;

    _flag = Number.MIN_VALUE;

    start () {
        this._flag = performance.now() + 1000;
    }

    update (deltaTime: number) {
        const now = performance.now();
        if (this._flag < now) {
            const rb = this.getComponent(RigidBodyComponent);
            if (rb) {
                rb.applyLocalTorque(new Vec3(0, this.torque, 0));
            }
            this._flag = now + this.interval * 1000;
        }
    }
}
