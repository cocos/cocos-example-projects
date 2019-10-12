import { _decorator, Component, Node, ICollisionEvent, ColliderComponent, RigidBodyComponent, Vec3 } from "cc";
import { v3_t } from "./TempConst";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("BallCtr")
@requireComponent(RigidBodyComponent)
export class BallCtr extends Component {

    rigidBody: RigidBodyComponent = null;

    @property
    velocity_y: number = 10;

    private _deadlockCount = 0;
    private _tempUuid = '';

    get isDeadlock () {
        return this._deadlockCount >= 3;
    }

    onLoad () {
        this.rigidBody = this.getComponent(RigidBodyComponent);
        this.rigidBody.allowSleep = false;
    }

    start () {
        const collider = this.getComponent(ColliderComponent);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Cube") {
            v3_t.set(0, this.velocity_y, 0);
            this.rigidBody.setLinearVelocity(v3_t);

            if (this._tempUuid == event.otherCollider.node.uuid) {
                this._deadlockCount++;
            } else {
                this._tempUuid = event.otherCollider.node.uuid;
                this._deadlockCount = 0;
            }
        }
    }

    update () {
        this.rigidBody.getLinearVelocity(v3_t);
        if (v3_t.y > this.velocity_y) {
            v3_t.set(0, this.velocity_y, 0);
            this.rigidBody.setLinearVelocity(v3_t);
        }
    }

    reset () {
        v3_t.set(0, 6, 4.5);
        this.node.worldPosition = v3_t;
    }
}
