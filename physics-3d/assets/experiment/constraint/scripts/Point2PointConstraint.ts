import { _decorator, Component, Node, RigidBodyComponent, Vec3, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

if (window.CC_PHYSICS_CANNON) {
    CANNON['staticBody'] = new CANNON.Body();
    CANNON.World['id2Constraint'] = {};
}

@ccclass('Point2PointConstraint')
export class Point2PointConstraint extends Component {

    @property({ type: RigidBodyComponent })
    connectedBody: RigidBodyComponent = null;

    @property({ type: RigidBodyComponent })
    selfBody: RigidBodyComponent = null;

    @property
    collideConnected = true;

    @property
    selfPivot = new Vec3();

    @property
    autoConfigureConnected = true;

    @property
    connectedPivot = new Vec3();

    @property
    breakEnable = false;

    @property({
        visible: function (this: Point2PointConstraint) {
            return this.breakEnable;
        }
    })
    breakForce = Number.MAX_VALUE;

    @property({
        visible: function (this: Point2PointConstraint) {
            return this.breakEnable;
        }
    })
    breakTorque = Number.MAX_VALUE;

    _p2p: CANNON.PointToPointConstraint | Ammo.btPoint2PointConstraint = null;

    start () {
        if (this.selfBody == null) {
            this.selfBody = this.getComponent(RigidBodyComponent);
        }

        if (this.autoConfigureConnected) {
            if (this.connectedBody) {
                const wp = this.selfBody.node.worldPosition;
                const cbwp = this.connectedBody.node.worldPosition;
                Vec3.add(this.connectedPivot, wp, this.selfPivot);
                Vec3.subtract(this.connectedPivot, this.connectedPivot, cbwp);
            } else {
                if (window.CC_PHYSICS_CANNON) {
                    const wp = this.selfBody.node.worldPosition;
                    Vec3.add(this.connectedPivot, wp, this.selfPivot);
                }
            }
        }

        if (window.CC_PHYSICS_CANNON) {
            if (this.selfBody) {
                const pa = new CANNON.Vec3();
                Vec3.copy(pa, this.selfPivot);
                const pb = new CANNON.Vec3();
                Vec3.copy(pb, this.connectedPivot);
                if (this.connectedBody) {
                    this._p2p = new CANNON.PointToPointConstraint(
                        (this.selfBody.body.impl as CANNON.Body),
                        pa,
                        (this.connectedBody.body.impl as CANNON.Body),
                        pb
                    )
                }
                else {
                    this._p2p = new CANNON.PointToPointConstraint(
                        (this.selfBody.body.impl as CANNON.Body),
                        pa,
                        (CANNON['staticBody'] as CANNON.Body),
                        pb
                    )
                }
                this._p2p.collideConnected = this.collideConnected;
                CANNON.World['id2Constraint'][this._p2p.id] = this._p2p;
            }
        } else if (window.CC_PHYSICS_AMMO) {
            if (this.selfBody) {
                if (this.connectedBody) {
                    const pa = new Ammo.btVector3(this.selfPivot.x, this.selfPivot.y, this.selfPivot.z);
                    const pb = new Ammo.btVector3(this.connectedPivot.x, this.connectedPivot.y, this.connectedPivot.z);
                    this._p2p = new Ammo.btPoint2PointConstraint(
                        (this.selfBody.body.impl as Ammo.btRigidBody),
                        (this.connectedBody.body.impl as Ammo.btRigidBody),
                        pa,
                        pb,
                    )
                } else {
                    const pa = new Ammo.btVector3(this.selfPivot.x, this.selfPivot.y, this.selfPivot.z);
                    this._p2p = new Ammo.btPoint2PointConstraint(
                        (this.selfBody.body.impl as Ammo.btRigidBody),
                        pa,
                    )
                }
                // this._p2p.setBreakingImpulseThreshold();
                // const jfb = new Ammo['ccJointFeedback']();
                // this._p2p.setJointFeedback(jfb);
                // this._p2p['jointFeedback'] = jfb;
            }
        }

        if (this.enabled) {
            this.onEnable();
        }
    }

    onEnable () {
        if (this._p2p) {
            if (window.CC_PHYSICS_CANNON) {
                const cw = PhysicsSystem.instance.physicsWorld.impl as CANNON.World;
                cw.addConstraint(this._p2p as CANNON.PointToPointConstraint);
            } else if (window.CC_PHYSICS_AMMO) {
                const cw = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
                cw.addConstraint(this._p2p as Ammo.btPoint2PointConstraint, !this.collideConnected);
            }
        }
    }

    onDisable () {
        if (this._p2p) {
            if (window.CC_PHYSICS_CANNON) {
                const cw = PhysicsSystem.instance.physicsWorld.impl as CANNON.World;
                cw.removeConstraint(this._p2p as CANNON.PointToPointConstraint);
            } else if (window.CC_PHYSICS_AMMO) {
                const cw = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
                cw.removeConstraint(this._p2p as Ammo.btPoint2PointConstraint);
            }
        }
    }

    lateUpdate (deltaTime: number) {
        if (this.breakEnable) {
            if (window.CC_PHYSICS_CANNON) {
                const sb = (this.selfBody.body.impl as CANNON.Body);
                const tb = (this.connectedBody.body.impl as CANNON.Body);
                const v3_0 = new Vec3();
                if (sb.type == CANNON.Body.DYNAMIC) {
                    Vec3.copy(v3_0, sb.velocity);
                    if (sb.linearFactor.x != 0) {
                        v3_0.x *= 1 / sb.linearFactor.x;
                    }
                    if (sb.linearFactor.y != 0) {
                        v3_0.y *= 1 / sb.linearFactor.y;
                    }
                    if (sb.linearFactor.z != 0) {
                        v3_0.z *= 1 / sb.linearFactor.z;
                    }
                    if (sb.world.dt != 0) {
                        Vec3.multiplyScalar(v3_0, v3_0, 1 / sb.world.dt);
                    }
                    const force = v3_0.length();
                    console.log(`sb force`, force);
                    if (force >= this.breakForce) {
                        this.enabled = false;
                    }

                    Vec3.copy(v3_0, sb.angularVelocity);
                    if (sb.angularFactor.x != 0) {
                        v3_0.x *= 1 / sb.angularFactor.x;
                    }
                    if (sb.angularFactor.y != 0) {
                        v3_0.y *= 1 / sb.angularFactor.y;
                    }
                    if (sb.angularFactor.z != 0) {
                        v3_0.z *= 1 / sb.angularFactor.z;
                    }
                    if (sb.world.dt != 0) {
                        Vec3.multiplyScalar(v3_0, v3_0, 1 / sb.world.dt);
                    }
                    const torque = v3_0.length();
                    console.log(`sb torque`, torque);
                    if (torque >= this.breakTorque) {
                        this.enabled = false;
                    }
                }
                if (tb.type == CANNON.Body.DYNAMIC) {
                    Vec3.copy(v3_0, tb.velocity);
                    if (tb.linearFactor.x != 0) {
                        v3_0.x *= 1 / tb.linearFactor.x;
                    }
                    if (tb.linearFactor.y != 0) {
                        v3_0.y *= 1 / tb.linearFactor.y;
                    }
                    if (tb.linearFactor.z != 0) {
                        v3_0.z *= 1 / tb.linearFactor.z;
                    }
                    if (tb.world.dt != 0) {
                        Vec3.multiplyScalar(v3_0, v3_0, 1 / tb.world.dt);
                    }
                    const force = v3_0.length();
                    console.log(`tb force`, v3_0.length());
                    if (force >= this.breakForce) {
                        this.enabled = false;
                    }

                    Vec3.copy(v3_0, tb.angularVelocity);
                    if (tb.angularFactor.x != 0) {
                        v3_0.x *= 1 / tb.angularFactor.x;
                    }
                    if (tb.angularFactor.y != 0) {
                        v3_0.y *= 1 / tb.angularFactor.y;
                    }
                    if (tb.angularFactor.z != 0) {
                        v3_0.z *= 1 / tb.angularFactor.z;
                    }
                    if (tb.world.dt != 0) {
                        Vec3.multiplyScalar(v3_0, v3_0, 1 / tb.world.dt);
                    }
                    const torque = v3_0.length();
                    console.log(`tb torque`, torque);
                    if (torque >= this.breakTorque) {
                        this.enabled = false;
                    }
                }
            } else if (window.CC_PHYSICS_AMMO) {
                const sb = (this.selfBody.body.impl as Ammo.btRigidBody);
                const tb = (this.connectedBody.body.impl as Ammo.btRigidBody);
                const v3_0 = new Vec3();
                if (!sb.isStaticOrKinematicObject()) {
                    const lv = sb.getLinearVelocity();
                    v3_0.set(lv.x(), lv.y(), lv.z());
                    Vec3.multiplyScalar(v3_0, v3_0, 60);
                    const force = v3_0.length();
                    console.log(`sb force`, force);
                    if (force >= this.breakForce) {
                        this.enabled = false;
                    }

                    const av = sb.getAngularVelocity();
                    v3_0.set(av.x(), av.y(), av.z());
                    Vec3.multiplyScalar(v3_0, v3_0, 60);
                    const torque = v3_0.length();
                    console.log(`sb torque`, torque);
                    if (torque >= this.breakTorque) {
                        this.enabled = false;
                    }
                }

                if (!tb.isStaticOrKinematicObject()) {
                    const lv = tb.getLinearVelocity();
                    v3_0.set(lv.x(), lv.y(), lv.z());
                    Vec3.multiplyScalar(v3_0, v3_0, 60);
                    const force = v3_0.length();
                    console.log(`tb force`, force);
                    if (force >= this.breakForce) {
                        this.enabled = false;
                    }

                    const av = tb.getAngularVelocity();
                    v3_0.set(av.x(), av.y(), av.z());
                    Vec3.multiplyScalar(v3_0, v3_0, 60);
                    const torque = v3_0.length();
                    console.log(`tb torque`, torque);
                    console.log(`sb torque`, torque);
                    if (torque >= this.breakTorque) {
                        this.enabled = false;
                    }
                }
            }
        }
    }
}
