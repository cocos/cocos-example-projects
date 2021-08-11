import { _decorator, Component, Node, Vec3, RigidBodyComponent, ColliderComponent, physics, ICollisionEvent, Collider, RigidBody } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('CCD.CcdTest')
@menu('experiment/ccd/CcdTest')
export class CcdTest extends Component {

    @property
    interval = 5; // second

    @property
    linearVelocity = 100000;

    @property(RigidBody)
    greenRigidBody: RigidBody = null!;

    private _initPos: Vec3[] = [];
    private _flag = Number.MIN_VALUE;

    start() {
        this.node.children.forEach((e: Node) => {
            this._initPos.push(e.worldPosition.clone());
        })

        const that = this;
        this.node.children.forEach((e: Node) => {
            const rb = e.getComponent(RigidBodyComponent)!;
            if (e.name.toLowerCase().search('ccd') != -1) {
                rb.useCCD = true;
                if (e.name.toLowerCase().search('event') != -1) {
                    e.getComponent(Collider)!.on('onCollisionEnter', this.onCollisionEnter, this);
                }
            }
            rb.setLinearVelocity(new Vec3(0, 0, -that.linearVelocity));
        })
        this._flag = performance.now() + this.interval * 1000;
    }

    update(deltaTime: number) {
        const now = performance.now();
        if (this._flag < now) {
            this.greenRigidBody.type = physics.ERigidBodyType.DYNAMIC;
            const that = this;
            this.node.children.forEach((e: Node, i: number) => {
                e.worldPosition = that._initPos[i];
                const rb = e.getComponent(RigidBodyComponent);
                if (rb) rb.setLinearVelocity(new Vec3(0, 0, -that.linearVelocity))
            })
            this._flag = now + this.interval * 1000;
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        console.log(event.selfCollider.node.name, "collide with", event.otherCollider.node.name);
        if (!this.greenRigidBody.isDynamic) return;
        this.greenRigidBody.type = physics.ERigidBodyType.STATIC;
        // this.greenRigidBody.clearState();
    }
}
