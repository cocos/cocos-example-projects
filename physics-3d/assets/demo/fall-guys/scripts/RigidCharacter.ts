import { _decorator, Component, Node, RigidBody, Vec3, PhysicsSystem, ICollisionEvent, Collider, IContactEquation, EPSILON } from 'cc';
const { ccclass, property, requireComponent, menu } = _decorator;
const _v3_0 = new Vec3();

class ContactPoint {
    point = new Vec3();
    normal = new Vec3();
    collider!: Collider;
    assign (ce: IContactEquation, c: Collider) {
        if (ce.isBodyA) {
            ce.getWorldNormalOnB(this.normal);
            ce.getWorldPointOnA(this.point);
        } else {
            (ce as any).getWorldNormalOnA(this.normal);
            ce.getWorldPointOnB(this.point);
        }
        this.collider = c;
        return this;
    }
}

const _ctPool: ContactPoint[] = [];
class ContactPool {
    static getContacts (ces: IContactEquation[], c: Collider, cps: ContactPoint[]) {
        for (let i = 0; i < ces.length; i++) {
            cps.push(this.getContact(ces[i], c));
        }
    }
    static getContact (ce: IContactEquation, c: Collider): ContactPoint {
        const cp = _ctPool.length > 0 ? _ctPool.pop()! : new ContactPoint();
        return cp.assign(ce, c);
    }
    static recyContacts (cps: ContactPoint[]) {
        Array.prototype.push.call(_ctPool, ...cps);
        cps.length = 0;
    }
}

@ccclass('FALL-GUYS.JumpParam')
class JumpParam {
    @property
    perpRatio = 0;
    @property
    steepPerpRatio = 0;
    @property
    height = 1;
    @property
    maxHeight = 1.5;
    @property
    rushHeight = 1;
    @property
    rushDistance = 2;
    @property
    maxRushDistance = 3;
}

@ccclass('FALL-GUYS.RigidCharacter')
@menu('demo/fall-guys/RigidCharacter')
@requireComponent(RigidBody)
export class RigidCharacter extends Component {

    @property
    maxSpeed = 5;

    @property
    damping = 0.5;

    @property
    slopeLimit = 30;

    // @property
    // heightLimit = 0;

    @property
    bullet = true;

    @property
    gravity = -20;

    @property(JumpParam)
    jumpParam = new JumpParam();

    _rigidBody: RigidBody = null!;
    _collider: Collider = null!;
    _grounded = true;
    _toSteep = false;
    _contacts: ContactPoint[] = [];
    _groundContact: ContactPoint = null!;
    _groundNormal = Vec3.UP.clone();
    _velocity = new Vec3();
    _jumpDir = new Vec3();

    get onGround () { return this._grounded; }
    get velocity () { return this._velocity; }
    get toSteep () { return this._toSteep; }

    start () {
        this._rigidBody = this.getComponent(RigidBody)!;
        this._collider = this.getComponent(Collider)!;
        this._collider.on('onCollisionEnter', this.onCollision, this);
        this._collider.on('onCollisionStay', this.onCollision, this);
        this._collider.on('onCollisionExit', this.onCollision, this);
        // if (this.bullet) useCCD(this._rigidBody);
    }

    move (dir: Vec3, speed: number) {
        this._rigidBody.getLinearVelocity(_v3_0);
        const y = _v3_0.y;
        Vec3.scaleAndAdd(_v3_0, _v3_0, dir, speed);
        _v3_0.y = 0;
        const ms = this.maxSpeed;
        const len = _v3_0.lengthSqr();
        if (len > ms) {
            _v3_0.normalize();
            _v3_0.multiplyScalar(ms);
        }
        _v3_0.y = y;
        this._rigidBody.setLinearVelocity(_v3_0);
    }

    jump (ratio: number) {
        const p = this.jumpParam;
        const dir = this._jumpDir;
        if (this.toSteep) {
            Vec3.lerp(dir, Vec3.UP, this._groundNormal, p.steepPerpRatio);
        } else {
            Vec3.lerp(dir, Vec3.UP, this._groundNormal, p.perpRatio);
        }
        const speed = this.calculateJumpVerticalSpeed(p.height + (p.maxHeight - p.height) * ratio);
        this._rigidBody.getLinearVelocity(_v3_0);
        Vec3.scaleAndAdd(_v3_0, _v3_0, dir, speed);
        this._rigidBody.setLinearVelocity(_v3_0);
    }

    rush () {

    }

    updateFunction (dt: number) {
        this.updateContactInfo();
        this.applyGravity();
        this.applyDamping();
        this.saveState();
    }

    applyDamping (dt = 1 / 60) {
        this._rigidBody.getLinearVelocity(_v3_0);
        const y = _v3_0.y;
        _v3_0.y = 0;
        if (_v3_0.lengthSqr() > EPSILON) {
            _v3_0.multiplyScalar(Math.pow(1.0 - this.damping, dt));
            _v3_0.y = y;
            this._rigidBody.setLinearVelocity(_v3_0);
        }
    }

    applyGravity () {
        const g = this.gravity;
        const m = this._rigidBody.mass;
        _v3_0.set(0, m * g, 0);
        this._rigidBody.applyForce(_v3_0)
    }

    saveState () {
        this._rigidBody.getLinearVelocity(this._velocity);
    }

    updateContactInfo () {
        this._grounded = false;
        this._groundContact = null!;
        let maxY = -0.001;
        for (let i = 0; i < this._contacts.length; i++) {
            const c = this._contacts[i];
            const n = c.normal;
            if (n.y < 0) continue;
            else {
                if (n.y > maxY) {
                    this._grounded = true;
                    maxY = n.y;
                    this._groundContact = c;
                }
            }
        }
        if (this._grounded) {
            Vec3.copy(this._groundNormal, this._groundContact.normal);
            this._toSteep = this._groundContact.normal.y <= Math.cos(this.slopeLimit * Math.PI / 180);
        } else {
            Vec3.copy(this._groundNormal, Vec3.UP);
            this._toSteep = false;
        }
        ContactPool.recyContacts(this._contacts);
    }

    calculateJumpVerticalSpeed (targetJumpHeight: number) {
        return Math.sqrt(2 * targetJumpHeight * Math.abs(this.gravity));
    }

    onCollision (event: ICollisionEvent) {
        ContactPool.getContacts(event.contacts, event.selfCollider, this._contacts);
    }

}

function useCCD (rb: RigidBody, ms = 0.001, sr = 0.05) {
    if (rb) {
        if (PhysicsSystem.PHYSICS_AMMO) {
            const Ammo = window['Ammo'];
            const impl = rb.body!.impl;
            impl['useCCD'] = true;
            const co = Ammo.castObject(impl, Ammo.btCollisionObject) as any;
            co['wrapped'] = rb.body;
            co['useCCD'] = true;
            impl.setCcdMotionThreshold(ms);
            impl.setCcdSweptSphereRadius(sr);
        } else if (PhysicsSystem.PHYSICS_PHYSX) {
            (rb.body as any).useCCD(sr > 0);
        }
    }
}