import { _decorator, Component, Node, ICollisionEvent, ColliderComponent, RigidBodyComponent, Vec3, systemEvent, SystemEventType, EventKeyboard, macro, Quat } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("BallCtr")
@requireComponent(RigidBodyComponent)
export class BallCtr extends Component {

    rigidBody: RigidBodyComponent = null;

    _linearVelocity: Vec3 = new Vec3();

    @property
    velocity_y: number = 10;

    onLoad () {
        this.rigidBody = this.getComponent(RigidBodyComponent);
    }

    start () {
        const collider = this.getComponent(ColliderComponent);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);

        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    onCollisionEnter (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Cube") {
            this._linearVelocity.set(0, this.velocity_y, 0);
            this.rigidBody.setLinearVelocity(this._linearVelocity);
        }
    }


    @property({ type: Node })
    columnNode: Node = null;

    onKeyDown (event: EventKeyboard) {
        if (event.keyCode == macro.KEY.a) {
            this.columnNode.rotate(_quat);
        } else if (event.keyCode == macro.KEY.d) {
            this.columnNode.rotate(_quat_inv);
        }
    }

}

const _quat = Quat.fromEuler(new Quat(), 0, 3, 0);
const _quat_inv = Quat.fromEuler(new Quat(), 0, -3, 0);
