import { _decorator, Component, math, systemEvent, macro, RigidBodyComponent, Touch, EventTouch, SystemEventType, EventKeyboard } from "cc";
const { ccclass, property } = _decorator;

const v3_0 = new math.Vec3();

enum EKey {
    NONE = 0,
    W = 1 << 0,
    A = 1 << 1,
    S = 1 << 2,
    D = 1 << 3,
    SHIFT = 1 << 4,
}

@ccclass("ballcontrol")
export class ballcontrol extends Component {

    @property({ slide: true, range: [1, 3, 0.01] })
    public readonly shiftScale = 2;

    private _rigidBody: RigidBodyComponent = null;

    private _key: number = EKey.NONE;

    start () {
        this._rigidBody = this.getComponent(RigidBodyComponent);
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
        }
    }

    onEnable () {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);
    }

    onDisable () {
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._key |= EKey.W;
        } else if (event.keyCode === macro.KEY.s) {
            this._key |= EKey.S;
        } else if (event.keyCode === macro.KEY.a) {
            this._key |= EKey.A;
        } else if (event.keyCode === macro.KEY.d) {
            this._key |= EKey.D;
        } else if (event.keyCode === macro.KEY.shift) {
            this._key |= EKey.SHIFT;
        }
    }

    onKeyUp (event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._key &= ~EKey.W;
        } else if (event.keyCode === macro.KEY.s) {
            this._key &= ~EKey.S;
        } else if (event.keyCode === macro.KEY.a) {
            this._key &= ~EKey.A;
        } else if (event.keyCode === macro.KEY.d) {
            this._key &= ~EKey.D;
        } else if (event.keyCode === macro.KEY.shift) {
            this._key &= ~EKey.SHIFT;
        }
    }

}
