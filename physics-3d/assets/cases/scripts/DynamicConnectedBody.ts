import { _decorator, Component, Node, physics, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DynamicConnectedBody')
export class DynamicConnectedBody extends Component {

    @property({ type: Node })
    public attached!: Node | null;

    @property({ type: Node })
    public connected!: Node | null;

    start() {
        if (!this.attached || !this.connected) return;

        // const joint = this.attached.getComponent(physics.FixedConstraint)!;

        // if (!joint) return;

        const collider = this.attached.getComponent(physics.Collider)!;
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    // collide event handle
    onCollisionEnter(event: ICollisionEvent) {
        console.log(event.selfCollider.node.name, "collide with", event.otherCollider.node.name);

        if (!this.attached) return;

        // get the rigidbody of the other collider
        const other = event.otherCollider.attachedRigidBody;

        const joint = this.attached.getComponent(physics.FixedConstraint)!;

        if (!joint) return;

        joint.connectedBody = other;
    }
}
