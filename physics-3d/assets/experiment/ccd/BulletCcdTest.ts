import { _decorator, Component, Node, Vec3, RigidBodyComponent, ColliderComponent } from 'cc';
const { ccclass, property, menu } = _decorator;

/**
 * Ammo CCD test, seems works single collision shape only for now.
 */
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

    start () {
        this.node.children.forEach((e: Node) => {
            this._initPos.push(e.worldPosition.clone());
        })

        const that = this;
        this.node.children.forEach((e: Node) => {
            const rb = e.getComponent(RigidBodyComponent);
            if (rb && window.CC_PHYSICS_AMMO) {
                if (e.name == "Sphere") {
                    rb.body.impl['useCCD'] = true;
                    const co = Ammo.castObject(rb.body.impl, Ammo.btCollisionObject);
                    co['wrapped'] = rb.body;
                    co['useCCD'] = true;
                    (rb.body.impl as Ammo.btRigidBody).setCcdMotionThreshold(this.ccdMotionThreshold);
                    (rb.body.impl as Ammo.btRigidBody).setCcdSweptSphereRadius(this.ccdSweptSphereRadius);
                }
                rb.setLinearVelocity(new Vec3(0, 0, -that.linearVelocity));
            }
        })
        this._flag = performance.now() + this.interval * 1000;
    }

    update (deltaTime: number) {
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
}
