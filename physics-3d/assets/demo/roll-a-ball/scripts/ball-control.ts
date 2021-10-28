import { _decorator, Component, math, systemEvent, KeyCode, RigidBodyComponent, Touch, EventTouch, SystemEventType, EventKeyboard, Vec3, clamp } from "cc";
const { ccclass, property, menu } = _decorator;

const v3_0 = new math.Vec3();
const v3_1 = new math.Vec3();
const v2_0 = new math.Vec2();

const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    w: 'w'.charCodeAt(0),
    s: 's'.charCodeAt(0),
    a: 'a'.charCodeAt(0),
    d: 'd'.charCodeAt(0),
};

enum EKey {
    NONE = 0,
    W = 1 << 0,
    A = 1 << 1,
    S = 1 << 2,
    D = 1 << 3,
    SHIFT = 1 << 4,
}

@ccclass("RALL-A-BALL.ballcontrol")
@menu("demo/roll-a-ball/ballcontrol")
export class ballcontrol extends Component {

    @property({ slide: true, range: [1, 3, 0.01] })
    public readonly shiftScale = 2;

    private _rigidBody: RigidBodyComponent = null!;

    private _key: number = EKey.NONE;

    start () {
        this._rigidBody = this.getComponent(RigidBodyComponent)!;
    }

    update (dt: number) {
        if (this._key & EKey.W) {
            v3_0.z = 1;
        }
        if (this._key & EKey.S) {
            v3_0.z = -1;
        }
        if (this._key & EKey.A) {
            v3_0.x = 1;
        }
        if (this._key & EKey.D) {
            v3_0.x = -1;
        }
        if (this._key & EKey.SHIFT) {
            v3_0.multiplyScalar(this.shiftScale);
        }

        if (v3_0.z != 0 || v3_0.x != 0) {
            this._rigidBody.applyImpulse(v3_0);
            v3_0.set(0, 0, 0);
            this._rigidBody.getLinearVelocity(v3_1);
            v3_1.x = clamp(v3_1.x, -4, 4);
            v3_1.y = clamp(v3_1.y, -4, 4);
            v3_1.z = clamp(v3_1.z, -4, 4);
            this._rigidBody.setLinearVelocity(v3_1);
        }
    }

    onEnable () {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);

        systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDisable () {
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEventType.KEY_UP, this.onKeyUp, this);

        systemEvent.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onKeyDown (event: EventKeyboard) {
        if (event.keyCode == KEYCODE.w || event.keyCode == KEYCODE.W) {
            this._key |= EKey.W;
        } else if (event.keyCode === KEYCODE.s || event.keyCode === KEYCODE.S) {
            this._key |= EKey.S;
        } else if (event.keyCode === KEYCODE.a || event.keyCode === KEYCODE.A) {
            this._key |= EKey.A;
        } else if (event.keyCode === KEYCODE.d || event.keyCode === KEYCODE.D) {
            this._key |= EKey.D;
        } else if (event.keyCode === KeyCode.SHIFT_LEFT ) {
            this._key |= EKey.SHIFT;
        }
    }

    onKeyUp (event: EventKeyboard) {
        if (event.keyCode == KEYCODE.w || event.keyCode == KEYCODE.W) {
            this._key &= ~EKey.W;
        } else if (event.keyCode === KEYCODE.s || event.keyCode === KEYCODE.S) {
            this._key &= ~EKey.S;
        } else if (event.keyCode === KEYCODE.a || event.keyCode === KEYCODE.A) {
            this._key &= ~EKey.A;
        } else if (event.keyCode === KEYCODE.d || event.keyCode === KEYCODE.D) {
            this._key &= ~EKey.D;
        } else if (event.keyCode === KeyCode.SHIFT_LEFT ) {
            this._key &= ~EKey.SHIFT;
        }
    }

    onTouchMove (touch: Touch, event: EventTouch) {
        touch.getDelta(v2_0);
        if (v2_0.x > 2) {
            this._key |= EKey.D;
            this._key &= ~EKey.A;
        } else if (v2_0.x < -2) {
            this._key |= EKey.A;
            this._key &= ~EKey.D;
        }
        if (v2_0.y > 2) {
            this._key |= EKey.W;
            this._key &= ~EKey.S;
        } else if (v2_0.y < -2) {
            this._key |= EKey.S;
            this._key &= ~EKey.W;
        }
    }

    onTouchEnd (touch: Touch, event: EventTouch) {
        this._key = EKey.NONE;
    }
}
