import { _decorator, Component, RigidBodyComponent, Vec3 } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("velocitytesting")
@menu("physics/velocitytesting")
export class velocitytesting extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        this.setLinearVelocity();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public setLinearVelocity () {
        let rigidBody = this.getComponent(RigidBodyComponent);
        if (rigidBody) {

            if(rigidBody.isSleeping){
                rigidBody.wakeUp();
            }
            rigidBody.setLinearVelocity(new Vec3(0, 10, 0));
        }
    }

    public setAngularVelocity () {
        let rigidBody = this.getComponent(RigidBodyComponent);
        if (rigidBody) {
            
            if(rigidBody.isSleeping){
                rigidBody.wakeUp();
            }
            rigidBody.setAngularVelocity(new Vec3(0, 10, 0));
        }
    }
}
