import { _decorator, Component, Node, RigidBodyComponent, Vec3, PhysicsSystem, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HingeConstraint')
export class HingeConstraint extends Component {
    @property({ type: RigidBodyComponent })
    connectedBody: RigidBodyComponent = null;

    @property({ type: RigidBodyComponent })
    selfBody: RigidBodyComponent = null;

    @property
    collideConnected = true;

    @property
    pivotA = new Vec3()

    @property
    pivotB = new Vec3()

    @property
    axisA = new Vec3()

    @property
    axisB = new Vec3()

    @property
    maxForce = 1e6;

    _hinge: CANNON.HingeConstraint | Ammo.btHingeConstraint = null;

    start () {
        if (this.selfBody == null) {
            this.selfBody = this.getComponent(RigidBodyComponent);
        }

        if (window.CC_PHYSICS_CANNON) {
            if (this.selfBody && this.connectedBody) {
                const pa = new CANNON.Vec3();
                const pb = new CANNON.Vec3();
                Vec3.copy(pa, this.pivotA);
                Vec3.copy(pb, this.pivotB);
                const xa = new CANNON.Vec3();
                const xb = new CANNON.Vec3();
                Vec3.copy(xa, this.axisA);
                Vec3.copy(xb, this.axisB);
                this._hinge = new CANNON.HingeConstraint(
                    (this.selfBody.body.impl as CANNON.Body),
                    (this.connectedBody.body.impl as CANNON.Body),
                    {
                        'maxForce': this.maxForce,
                        'pivotA': pa,
                        'pivotB': pb,
                        'axisA': xa,
                        'axisB': xb,
                    }
                )
                this._hinge.collideConnected = this.collideConnected;
                const cw = PhysicsSystem.instance.physicsWorld.impl as CANNON.World;
                cw.addConstraint(this._hinge);
                CANNON.World['id2Constraint'][this._hinge.id] = this._hinge;
            }
        } else if (window.CC_PHYSICS_AMMO) {
            if (this.selfBody) {
                const pa = new Ammo.btVector3(this.pivotA.x, this.pivotA.y, this.pivotA.z);
                const xa = new Ammo.btVector3(this.axisA.x, this.axisA.y, this.axisA.z);
                if (this.connectedBody) {
                    const pb = new Ammo.btVector3(this.pivotB.x, this.pivotB.y, this.pivotB.z);
                    const xb = new Ammo.btVector3(this.axisB.x, this.axisB.y, this.axisB.z);
                    this._hinge = new Ammo.btHingeConstraint(
                        (this.selfBody.body.impl as Ammo.btRigidBody),
                        (this.connectedBody.body.impl as Ammo.btRigidBody),
                        pa, pb, xa, xb,
                    )
                } else {
                    const quat = new Quat();
                    Quat.fromEuler(quat, -90, 0, 0);
                    const qa = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
                    const rbAFrame = new Ammo.btTransform();
                    rbAFrame.setIdentity();
                    rbAFrame.setOrigin(pa);
                    rbAFrame.setRotation(qa);
                    this._hinge = new Ammo.btHingeConstraint(
                        (this.selfBody.body.impl as Ammo.btRigidBody),
                        rbAFrame
                    )
                }
                const cw = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
                cw.addConstraint(this._hinge, !this.collideConnected);
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
