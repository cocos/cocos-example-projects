import { _decorator, Component, RigidBodyComponent, Vec3 } from "cc";
const { menu, ccclass, property, requireComponent } = _decorator;

@ccclass("CASES.DynamicTest")
@menu("cases/DynamicTest")
@requireComponent(RigidBodyComponent)
export class DynamicTest extends Component {

    @property
    readonly USE_LOCAL = false;

    @property
    readonly pointOfAction = new Vec3();

    @property
    readonly USE_IMPULSE = false;

    @property({ visible: function (this: DynamicTest) { return this.USE_IMPULSE } })
    readonly impulse = new Vec3();

    @property
    readonly USE_FORCE = false;

    @property({ visible: function (this: DynamicTest) { return this.USE_FORCE } })
    readonly force = new Vec3();

    @property
    readonly USE_TORQUE = false;

    @property({ visible: function (this: DynamicTest) { return this.USE_TORQUE } })
    readonly torque = new Vec3();

    start () {
        // deactive dynamic body, test with some api
        let rigidbody = this.getComponent(RigidBodyComponent)!;
        rigidbody.node.active = false;
        rigidbody.applyForce(Vec3.ONE);
        rigidbody.clearState();
        rigidbody.wakeUp();
        rigidbody.sleep();
        rigidbody.isAwake;
        rigidbody.isSleeping;
        rigidbody.isSleepy;

        rigidbody.node.active = true;
    }

    applyImpulse () {
        if (!this.USE_IMPULSE) return;
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            if (this.USE_LOCAL) {
                rigidbody.applyLocalImpulse(this.impulse, this.pointOfAction);
            } else {
                rigidbody.applyImpulse(this.impulse, this.pointOfAction);
            }
        }
    }

    applyFoce () {
        if (!this.USE_FORCE) return;
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            if (this.USE_LOCAL) {
                rigidbody.applyLocalForce(this.force, this.pointOfAction);
            } else {
                rigidbody.applyForce(this.force, this.pointOfAction);
            }
        }
    }

    applyTorque () {
        if (!this.USE_TORQUE) return;
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            if (this.USE_LOCAL) {
                rigidbody.applyLocalTorque(this.torque);
            } else {
                rigidbody.applyTorque(this.torque);
            }
        }
    }
}
