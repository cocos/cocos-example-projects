import { _decorator, Component, RigidBodyComponent, Vec3 } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("forcetesting")
@menu("physics/forcetesting")
export class forcetesting extends Component {

    @property
    public force: Vec3 = new Vec3;

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

    public applyForce () {
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            rigidbody.applyForce(this.force, this.worldPoint);
        }
    }


    public applyLocalForce () {
        let rigidbody = this.getComponent(RigidBodyComponent);
        if (rigidbody) {
            rigidbody.applyLocalForce(this.force, this.localPoint);
        }
    }

}
