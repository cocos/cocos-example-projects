const { vec3, quat } = cc.vmath;
const { ccclass } = cc._decorator;

@ccclass
class FirstPersonCamera extends cc.Component {

	constructor() {
		super();

		this._lbtnDown = false;
		this._rbtnDown  = false;
		this._keyStates = new Array(128);
		this._keyStates.fill(false);
		this.dir = cc.v3();
	}

	start () {
		const cameraComponent = this.node.getComponent("cc.CameraComponent");
		if (!cameraComponent) {
			console.error(`Cannot find cc.CameraComponent on node ${this.node.name}`);
		}

		cc.eventManager.setEnabled(true);

		const mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseDown: this._mouseDownHandler.bind(this),
			onMouseMove: this._mouseMoveHandler.bind(this),
			onMouseUp: this._mouseUpHandler.bind(this),
			onMouseScroll: this._mouseWheelHandler.bind(this),
		});
		cc.eventManager.addListener(mouseListener, 1);

		const keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this._keyDownHandler.bind(this),
			onKeyReleased: this._keyUpHandler.bind(this),
		});
		cc.eventManager.addListener(keyListener, 1);

		const touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this._TouchBeginHandler.bind(this),
			onTouchMoved: this._TouchMoveHandler.bind(this),
			onTouchEnded: this._TouchEndHandler.bind(this),
		});
		cc.eventManager.addListener(touchListener, 1);

		cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this._TouchBeginHandler, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this._TouchMoveHandler, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this._TouchEndHandler, this);
	}

	update (dt) {
		const translationDelta = dt * 10;
		const isKeyPressing = (keystr) => this._keyStates[keystr.charCodeAt(0)];
		if (isKeyPressing("W")) {
			this._translate(this._getForward(), translationDelta);
		}
		if (isKeyPressing("S")) {
			this._translate(this._getForward(), -translationDelta);
		}
		if (isKeyPressing("A")) {
			this._translate(this._getRight(), -translationDelta);
		}
		if (isKeyPressing("D")) {
			this._translate(this._getRight(), translationDelta);
		}
		if (isKeyPressing("Q")) {
			this._translate(cc.v3(0, 1, 0), -translationDelta);
		}
		if (isKeyPressing("E")) {
			this._translate(cc.v3(0, 1, 0), translationDelta);
		}
		if (this.moving) {
			this._translate(this.dir, translationDelta);
		}
	}

	_mouseWheelHandler(event) {
		const delta = event._scrollY / 120; // forward to screen is positive
		this._translate(this._getForward(), delta);
	}

	_mouseDownHandler(event) {
		if (event._button === 0) {
			this._lbtnDown = true;
		} else if (event._button === 1) {
			this._mbtnDown = true;
		} else if (event._button === 2) {
        	cc.game.canvas.requestPointerLock();
			this._rbtnDown = true;
		}
	}

	_mouseUpHandler(event) {
		if (event._button === 0) {
			this._lbtnDown = false;
		} else if (event._button === 1) {
			this._mbtnDown = false;
		} else if (event._button === 2) {
        	document.exitPointerLock();
			this._rbtnDown = false;
		}
	}

	_mouseMoveHandler(event) {
		const dx = event.movementX;
		const dy = -event.movementY;

		if (dx !== 0) {
			if (this._rbtnDown) {
				this._rotateSelfHorizon(dx / 5);
			}
		}

		if (dy !== 0) {
			if (this._rbtnDown) {
				this._rotateSelfVertical(dy / 5);
			}
		}
	}

	_keyDownHandler(keycode) {
		if (keycode < this._keyStates.length) {
			this._keyStates[keycode] = true;
		}
	}

	_keyUpHandler(keycode) {
		if (keycode < this._keyStates.length) {
			this._keyStates[keycode] = false;
		}
	}

	_TouchBeginHandler(event) {
		const startX = event._startPoint.x;
		if (startX < cc.winSize.width / 2) {
			this.moving = true;
			vec3.set(this.dir, 0, 0, 0);
		}
	}

	_TouchMoveHandler(event) {
		const startX = event._startPoint.x;
		if (startX > cc.winSize.width / 2) { // rotate
			const d = event.getDelta();
			this._rotateSelfHorizon(d.x / 5);
			this._rotateSelfVertical(d.y / 5);
		} else { // translate
			const x = event.getLocationX();
			const y = event.getLocationY();
			const startY = event._startPoint.x;
			this.dir = this._getDirection(x - startX, 0, startY - y).normalizeSelf();
		}
	}

	_TouchEndHandler(event) {
		const startX = event._startPoint.x;
		if (startX < cc.winSize.width / 2) {
			this.moving = false;
		}
	}

	_translate(direction, delta) {
		const position = this.node.getPosition();
		vec3.scaleAndAdd(position, position, direction, delta);
		this.node.setPosition(position);
	}

	_rotateSelfHorizon(delta) {
		const rotation = this.node.getRotation();
		const up = cc.v3(0, 1, 0);
		//const up = this._getUp();
		quat.rotateAround(rotation, rotation, up, -delta/ 360.0 * 3.14159265);
		this.node.setRotation(rotation);
	}

	_rotateSelfVertical(delta) {
		const rotation = this.node.getRotation();
		//const right = cc.v3(1, 0, 0);
		const right = this._getRight();
		quat.rotateAround(rotation, rotation, right, delta / 360.0 * 3.14159265);
		this.node.setRotation(rotation);
	}

	_getForward() {
		return this._getDirection(0, 0, -1);
	}

	_getRight() {
		return this._getDirection(1, 0, 0);
	}

	_getUp() {
		return this._getDirection(0, 1, 0);
	}

	_getDirection(x, y, z) {
		const result = cc.v3(x, y, z);
		vec3.transformQuat(result, result, this.node.getRotation());
		return result;
	}
}
