import { _decorator, Component, math, systemEvent, SystemEvent, game, KeyCode, director, EventTouch, EventKeyboard, Touch, clamp } from "cc";
const { ccclass, property, menu } = _decorator;

const v2_1 = new math.Vec2();
const v2_2 = new math.Vec2();
const v3_1 = new math.Vec3();
const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    w: 'w'.charCodeAt(0),
    s: 's'.charCodeAt(0),
    a: 'a'.charCodeAt(0),
    d: 'd'.charCodeAt(0),
    SHIFT: KeyCode.SHIFT_LEFT ,
};

@ccclass("SIMPLE-HOLE.MotionCtr")
@menu("demo/simple-hole/MotionCtr")
export class MotionCtr extends Component {

    @property
    moveSpeed = 1;

    @property
    moveSpeedShiftScale = 5;

    @property({ slide: true, range: [0.05, 0.5, 0.01] })
    damp = 0.2;

    _euler = new math.Vec3();
    _velocity = new math.Vec3();
    _position = new math.Vec3();
    _speedScale = 1;

    start() {
        math.Vec3.copy(this._euler, this.node.eulerAngles);
        math.Vec3.copy(this._position, this.node.position);
    }

    update(dt: number) {
        // position
        math.Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        math.Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        math.Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);

        if (v3_1.x < -17 || v3_1.x > 17 || v3_1.z < -17 || v3_1.z > 17)
            this._position.set(v3_1);

        v3_1.x = clamp(v3_1.x, -17, 17);
        v3_1.z = clamp(v3_1.z, -17, 17);

        this.node.setPosition(v3_1);
    }

    onDestroy() {
        this._removeEvents();
    }

    onEnable() {
        this._addEvents();
    }

    onDisable() {
        this._removeEvents();
    }

    private _addEvents() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private _removeEvents() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onKeyDown(e: EventKeyboard) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (e.keyCode === KEYCODE.W || e.keyCode === KEYCODE.w) { if (v.z === 0) { v.z = -1.25; } }
        else if (e.keyCode === KEYCODE.S || e.keyCode === KEYCODE.s) { if (v.z === 0) { v.z = 1.25; } }
        else if (e.keyCode === KEYCODE.A || e.keyCode === KEYCODE.a) { if (v.x === 0) { v.x = -1.25; } }
        else if (e.keyCode === KEYCODE.D || e.keyCode === KEYCODE.d) { if (v.x === 0) { v.x = 1.25; } }
    }

    onKeyUp(e: EventKeyboard) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (e.keyCode === KEYCODE.W || e.keyCode === KEYCODE.w) { if (v.z < 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.S || e.keyCode === KEYCODE.s) { if (v.z > 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.A || e.keyCode === KEYCODE.a) { if (v.x < 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.D || e.keyCode === KEYCODE.d) { if (v.x > 0) { v.x = 0; } }
    }

    onTouchMove(e: Touch) {
        e.getStartLocation(v2_1);

        e.getLocation(v2_2);
        math.Vec2.subtract(v2_2, v2_2, v2_1);
        this._velocity.x = v2_2.x * 0.01;
        this._velocity.z = -v2_2.y * 0.01;
        this._velocity.x = this._velocity.x < 0 ? this._velocity.x - 0.75 : this._velocity.x + 0.75;
        this._velocity.z = this._velocity.z < 0 ? this._velocity.z - 0.75 : this._velocity.z + 0.75;
        this._velocity.x = clamp(this._velocity.x, -1.25, 1.25);
        this._velocity.z = clamp(this._velocity.z, -1.25, 1.25);
    }

    onTouchEnd(e: Touch) {
        e.getStartLocation(v2_1);
        this._velocity.x = 0;
        this._velocity.z = 0;
    }

    changeEnable() {
        this.enabled = !this.enabled;
    }
}
