import { _decorator, Component, Node, ICollisionEvent, ColliderComponent, RigidBodyComponent, Vec3, Texture2D, SphereColliderComponent } from "cc";
import { v3_t } from "./TempConst";
import { ColumnCtr } from "./ColumnCtr";
import { FloorFlagCtr } from "./FloorFlagCtr";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("FALLING-BALL.BallCtr")
@requireComponent(RigidBodyComponent)
export class BallCtr extends Component {

    rigidBody: RigidBodyComponent = null;

    @property
    velocity_y: number = 10;

    @property({ type: ColumnCtr })
    columnCtr: ColumnCtr = null;

    @property({ type: FloorFlagCtr })
    floorFlagCtr: FloorFlagCtr = null;

    private _deadlockCount = 0;
    private _tempUuid = '';

    private _hitRedFlag = 0;
    get hitRed () {
        return this._hitRedFlag == 1;
    }

    get isDeadlock () {
        return this._deadlockCount >= 2;
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
        v3_t.set(this.node.worldPosition);
        v3_t.y = event.otherCollider.node.worldPosition.y + 1; // 1 = radius + halfY
        this.node.worldPosition = v3_t;

        if (event.otherCollider.node.name == "CubeRed") {
            this._hitRedFlag = 1;
            if (window.CC_PHYSICS_AMMO) {
                this.rigidBody.body.impl.clearState();
            } else if (window.CC_PHYSICS_CANNON) {
                this.rigidBody.body.impl.sleep();
                this.rigidBody.body.impl.wakeUp();
            }
            this.rigidBody.mass = 0;
            this.columnCtr.enabled = false;
            this.floorFlagCtr.enabled = false;
        } else if (event.otherCollider.node.name == "Cube") {
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
        if (v3_t.y < -60) {
            v3_t.set(0, -60, 0);
            this.rigidBody.setLinearVelocity(v3_t);
        }
    }

    reset () {
        this.rigidBody.mass = 10;
        if (window.CC_PHYSICS_CANNON) {
            (this.rigidBody.body.impl as CANNON.Body).type = CANNON.Body.DYNAMIC;
        }
        this._hitRedFlag = 0;
        v3_t.set(0, 6, 4.5);
        this.node.worldPosition = v3_t;
    }
}