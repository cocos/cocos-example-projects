import { _decorator, Component, RigidBodyComponent, Vec3 } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("impulsetesting")
@menu("physics/impulsetesting")
export class impulsetesting extends Component {

    @property
    public impulse: Vec3 = new Vec3;

    @property
    public worldPoint: Vec3 = new Vec3;

    @property
    public localPoint: Vec3 = new Vec3;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public applyImpulse () {
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            rigidbody.applyImpulse(this.impulse, this.worldPoint);
        }
    }


    public applyLocalImpulse () {
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            rigidbody.applyLocalImpulse(this.impulse, this.localPoint);
        }
    }
}
