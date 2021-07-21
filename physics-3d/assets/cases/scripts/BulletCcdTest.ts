import { _decorator, Component, Node, Vec3, RigidBodyComponent, ColliderComponent, physics, ICollisionEvent, Collider } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('CCD.BulletCcdTest')
@menu('experiment/ccd/BulletCcdTest')
export class BulletCcdTest extends Component {

    @property
    interval = 5; // second

    @property
    linearVelocity = 100000;

    @property
    ccdSweptSphereRadius = 0.1;

    @property
    ccdMotionThreshold = 0.0000001;

    private _initPos: Vec3[] = [];
    private _flag = Number.MIN_VALUE;

    start() {
        this.node.children.forEach((e: Node) => {
            this._initPos.push(e.worldPosition.clone());
        })

        const that = this;
        // this.node.children.forEach((e: Node) => {
        //     const rb = e.getComponent(RigidBodyComponent)!;
        //     if (e.name.toLowerCase().search('ccd') != -1) {
        //         if (physics.PhysicsSystem.PHYSICS_AMMO) {
        //             (rb.body!.impl as Ammo.btRigidBody).setCcdMotionThreshold(this.ccdMotionThreshold);
        //             (rb.body!.impl as Ammo.btRigidBody).setCcdSweptSphereRadius(this.ccdSweptSphereRadius);
        //         } else if (physics.PhysicsSystem.PHYSICS_PHYSX) {
        //             rb.body!.impl.setRigidBodyFlag((globalThis as any).PhysX.RigidBodyFlag.eENABLE_CCD, true);
        //         } else if (physics.PhysicsSystem.PHYSICS_CANNON) {
        //             if (e.name.toLowerCase().search('sphere') != -1) {
        //                 rb.body!.impl.ccdSpeedThreshold = this.ccdSweptSphereRadius;
        //             }
        //         }
        //         if (e.name.toLowerCase().search('event') != -1) {
        //             e.getComponent(Collider)!.on('onCollisionEnter', this.onCollisionEnter, this);
        //         }
        //     }
        //     rb.setLinearVelocity(new Vec3(0, 0, -that.linearVelocity));
        // })
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
    }
}
