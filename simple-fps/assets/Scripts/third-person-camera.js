@cc._decorator.ccclass()
class ThirdPersonCamera extends cc.Component {
    @cc._decorator.property(cc.Node)
    target = null;

    @cc._decorator.property(Number)
    distance = 100;

    @cc._decorator.property(Number)
    minDistance = 10;

    @cc._decorator.property(Number)
    maxDistance = 200;
	
	constructor() {
		super();
		
		this._lbtnDown = false;
		this._rbtnDown  = false;
		this._keyStates = new Array(128);
        this._keyStates.fill(false);
        
        this._viewDir = new cc.Vec3(1, 0.5, 1);
        cc.vmath.vec3.normalize(this._viewDir, this._viewDir);

        this._viewVector = new cc.Vec3(0, 0, 0);
	}
	
	start () {
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
        if (!this.target) {
            return;
        }
        
        cc.vmath.vec3.scale(this._viewVector, this._viewDir, this.distance);

        const targetPosition = this.target.getPosition();

        const cameraPosition = new cc.Vec3();
        cc.vmath.vec3.add(cameraPosition, targetPosition, this._viewVector);
        this.node.setPosition(cameraPosition);
        this.node.lookAt(targetPosition);
    }
    
    _setDistance(value) {
        this.distance = cc.vmath.clamp(value, this.minDistance, this.maxDistance);
    }
	
	_mouseWheelHandler(event) {
        const delta = event._scrollY / 120; // forward to screen is positive
        this._setDistance(this.distance - delta);
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
	
	_rotateSelfHorizon(delta) {
		const up = cc.v3(0, 1, 0);
        this._rotate(-delta/ 360.0 * 3.14159265, up);
	}
	
	_rotateSelfVertical(delta) {
        const up = cc.v3(0, 1, 0);
        const right = new cc.Vec3();
        cc.vmath.vec3.cross(right, this._viewDir, up);
        cc.vmath.vec3.normalize(right, right);
        this._rotate(-delta/ 360.0 * 3.14159265, right);
    }
    
    _rotate(angle, axis) {
        const rotation = cc.vmath.quat.create();
        cc.vmath.quat.rotateAround(rotation, rotation, axis, angle);
        cc.vmath.vec3.transformQuat(this._viewDir, this._viewDir, rotation);
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