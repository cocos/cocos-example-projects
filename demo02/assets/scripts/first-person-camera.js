import { _decorator, Component, Quat, Vec2, Vec3, vmath } from "Cocos3D";
const { ccclass, property } = _decorator;
const { vec3, quat } = vmath;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v3_1 = new Vec3();
const qt_1 = new Quat();
const id_forward = new Vec3(0, 0, 1);
const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
	D: 'D'.charCodeAt(0),
    Q: 'Q'.charCodeAt(0),
	E: 'E'.charCodeAt(0),
	SHIFT: cc.macro.KEY.shift,
};

@ccclass
export class FirstPersonCamera extends Component {

	@property
	moveSpeed = 1;

	@property
	moveSpeedShiftScale = 5;

	@property({ slide: true, range: [0.05, 0.5, 0.01] })
	damp = 0.2;

	@property
	rotateSpeed = 1;


	_euler = new Vec3();
	_velocity = new Vec3();
	_position = new Vec3();
	_speedScale = 1;

	onLoad () {
		cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
		vec3.copy(this._euler, this.node.eulerAngles);
		vec3.copy(this._position, this.node.position);
	}

	onDestroy () {
		cc.systemEvent.off(cc.SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
	}

	update (dt) {
		// position
		vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
		vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
		vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
		this.node.setPosition(v3_1);
		// rotation
		quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
		quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
		this.node.setRotation(qt_1);
    }

	onMouseWheel (e) {
		const delta = -e.getScrollY() * this.moveSpeed / 24; // delta is positive when scroll down
		vec3.transformQuat(v3_1, id_forward, this.node.rotation);
		vec3.scaleAndAdd(v3_1, this.node.position, v3_1, delta);
		this.node.setPosition(v3_1);
	}

	onKeyDown (e) {
		const v = this._velocity;
		if      (e.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (e.keyCode === KEYCODE.W) { if (v.z === 0) { v.z = -1; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z === 0) { v.z =  1; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x === 0) { v.x = -1; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x === 0) { v.x =  1; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y === 0) { v.y = -1; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y === 0) { v.y =  1; } }
	}

	onKeyUp (e) {
		const v = this._velocity;
		if      (e.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (e.keyCode === KEYCODE.W) { if (v.z < 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z > 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x < 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x > 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y < 0) { v.y = 0; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y > 0) { v.y = 0; } }
	}

	onTouchStart (e) {
		if (cc.game.canvas.requestPointerLock) cc.game.canvas.requestPointerLock();
	}

	onTouchMove (e) {
		e.getStartLocation(v2_1);
		if (v2_1.x > cc.winSize.width * 0.4) { // rotation
			e.getDelta(v2_2);
			this._euler.y -= v2_2.x * 0.5;
			this._euler.x += v2_2.y * 0.5;
		} else { // position
			e.getLocation(v2_2);
			vec3.subtract(v2_2, v2_2, v2_1);
			this._velocity.x = v2_2.x * 0.01;
			this._velocity.z = -v2_2.y * 0.01;
		}
	}

	onTouchEnd (e) {
		if (document.exitPointerLock) document.exitPointerLock();
		e.getStartLocation(v2_1);
		if (v2_1.x < cc.winSize.width * 0.4) { // position
			this._velocity.x = 0;
			this._velocity.z = 0;
		}
	}
}
