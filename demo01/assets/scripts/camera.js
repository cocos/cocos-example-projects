@cc._decorator.ccclass()
class FirstPersonCamera extends cc.Component {

	constructor() {
		super();

		this._lbtnDown = false;
		this._rbtnDown  = false;
		this._keyStates = new Array(128);
		this._keyStates.fill(false);
	}

	start () {
		const cameraComponent = this.node.getComponent("cc.CameraComponent");
		if (!cameraComponent) {
			console.error(`Cannot find cc.CameraComponent on node ${this.node.name}`);
		}

		cc.eventManager.setEnabled(true);

		const mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseDown: (...args) => this._mouseDownHandler(...args),
			onMouseMove: (...args) => this._mouseMoveHandler(...args),
			onMouseUp: (...args) => this._mouseUpHandler(...args),
			onMouseScroll: (...args) => this._mouseWheelHandler(...args),
		});
		cc.eventManager.addListener(mouseListener, 1);

		const keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: (...args) => this._keyDownHandler(...args),
			onKeyReleased: (...args) => this._keyUpHandler(...args),
		});
		cc.eventManager.addListener(keyListener, 1);
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

	_translate(direction, delta) {
		const position = this.node.getPosition();
		cc.vmath.vec3.scaleAndAdd(position, position, direction, delta);
		this.node.setPosition(position);
	}

	_rotateSelfHorizon(delta) {
		const rotation = this.node.getRotation();
		const up = cc.v3(0, 1, 0);
		//const up = this._getUp();
		cc.vmath.quat.rotateAround(rotation, rotation, up, -delta/ 360.0 * 3.14159265);
		this.node.setRotation(rotation);
	}

	_rotateSelfVertical(delta) {
		const rotation = this.node.getRotation();
		//const right = cc.v3(1, 0, 0);
		const right = this._getRight();
		cc.vmath.quat.rotateAround(rotation, rotation, right, delta / 360.0 * 3.14159265);
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
		cc.vmath.vec3.transformQuat(result, result, this.node.getRotation());
		return result;
	}
}
