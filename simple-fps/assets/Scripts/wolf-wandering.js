import { WolfState, States } from './wolf-state';

const state = {
	idle: 0,
	walk: 1,
	wait: 2,
}
@cc._decorator.ccclass()
class WolfController extends cc.Component {

	@cc._decorator.property(Number)
	moveSpeed = 1;
	@cc._decorator.property(Number)
	dist = 10;
	
	constructor() {
		super();
	}
	
	start () {
		
		this.status = state.idle;
		this.oriPosition = this.node.getWorldPosition();
		//this.direction = this.getMoveDirection();
		this.node.on('collided',(para) => {
			if(para.source.name === 'bullet'){
				this._switchState(States.death);
				setTimeout(() => {
					this.node.active = false;
				}, 500);
			}
			else if(para.source.name === 'wolf'){
				cc.vmath.vec3.negate(this.direction,this.direction);
			}
		});
    }
	
	update (dt) {
		//const translationDelta = dt * 10 * this.moveSpeed;
        if(this.status === state.idle){
			this.status = state.wait;
			setTimeout(() => {
				//this.getMoveDirection();
				this.oriPosition = this.node.getWorldPosition();
				this._rotateSelfHorizon(Math.random()* 360.0);
				this._switchState(States.run);
				this.status = state.walk;
				//console.log('begin walk',this);
			},  Math.random() *  6000);
		}
		else if(this.status === state.walk){
			this._translate(this._getForward(),dt * 10 *this.moveSpeed);
			if(cc.vmath.vec3.distance(this.node.getWorldPosition(),this.oriPosition) > this.dist){
				this._switchState(States.idle);
				this.status = state.idle;
				//console.log('end walk',this);
			}
		}
    }
	
/* 	getMoveDirection() {
        const position = new cc.Vec3(
            Math.random(),
            0,
            Math.random(),
		);
		cc.vmath.vec3.normalize(position,position);
		this.oriPosition = this.node.getWorldPosition();
        return position;
	} */

	_rotateSelfHorizon(delta) {
		const rotation = this.node.getRotation();
		const up = cc.v3(0, 1, 0);
		//const up = this._getUp();
		cc.vmath.quat.rotateAround(rotation, rotation, up, -delta/ 360.0 * 3.14159265);
		this.node.setRotation(rotation);
	}

    _switchState (state) {
        const stateComponent = this.node.getComponent(WolfState);
        if (stateComponent) {
            stateComponent.switchTo(state);
        }
    }
	
	_translate(direction, delta) {
		const position = this.node.getPosition();
		cc.vmath.vec3.scaleAndAdd(position, position, direction, delta);
		this.node.setPosition(position);
	}
	
	_getForward() {
		return this._getDirection(0, 0, 1);
	}
	
	_getRight() {
		return this._getDirection(-1, 0, 0);
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