import { EnemyState, States } from './enemy-state';
//import { timingSafeEqual } from 'crypto';

const state = {
	idle: 0,
	walk: 1,
	wait: 2,
	collider: 3,
}
@cc._decorator.ccclass()
export class EnemyController extends cc.Component {

	@cc._decorator.property
	moveSpeed = 1;
	@cc._decorator.property
	dist = 10;

	constructor() {
		super();
	}

	start () {
		this.status = state.idle;
		this.oriPosition = this.node.getWorldPosition();

		var collider = this.node.getComponent(cc.ColliderComponent);
		collider.on('onCollisionEnter',this.onCollision,this);
    }

	update (dt) {
		//const translationDelta = dt * 10 * this.moveSpeed;
		//console.log(this.status);
        if(this.status === state.idle){
			this.status = state.wait;
			setTimeout(() => {
				//this.getMoveDirection();
				if(this.status != state.collider){
					this.oriPosition = this.node.getWorldPosition();
					this._rotateSelfHorizon(Math.random()* 360.0);
					this._switchState(States.run);
					this.status = state.walk;
				}
			//	console.log('begin walk',this);
			},  Math.random() *  6000);
		}
		else if(this.status === state.walk){
			this._translate(this._getForward(),dt * 10 *this.moveSpeed);
			//this.node.getComponent(cc.BoxColliderComponent).syncPhysWithScene();
			if(cc.math.Vec3.distance(this.node.getWorldPosition(),this.oriPosition) > this.dist){
				this._switchState(States.idle);
				this.status = state.idle;
			//	console.log('end walk',this);
			}
		}
	//	console.log('enemy update');
    }

/* 	getMoveDirection() {
        const position = new cc.Vec3(
            Math.random(),
            0,
            Math.random(),
		);
		cc.math.Vec3.normalize(position,position);
		this.oriPosition = this.node.getWorldPosition();
        return position;
	} */

	_rotateSelfHorizon(delta) {
		const rotation = this.node.getRotation();
		const up = cc.v3(0, 1, 0);
		//const up = this._getUp();
		cc.math.Quat.rotateAround(rotation, rotation, up, -delta/ 360.0 * 3.14159265);
		this.node.setRotation(rotation);
	}

    _switchState (state) {
	//	console.log(this.node);
        const stateComponent = this.node.getComponent(EnemyState);
        if (stateComponent) {
            stateComponent.switchTo(state);
        }
    }

	_translate(direction, delta) {
		const position = this.node.getPosition();
		cc.math.Vec3.scaleAndAdd(position, position, direction, delta);
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
		cc.math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
	}

	onCollision (event) {
		if(event.otherCollider.node._name == 'bullet'){
            this.score += 1;
			event.otherCollider.node.getComponent(cc.BoxColliderComponent).enabled = false;
			event.otherCollider.node.active = false;
			event.selfCollider.node.getComponent(cc.BoxColliderComponent).enabled = false;
            this.status = state.collider;
				this._switchState(States.death);
				setTimeout(() => {
					this.node.active = false;
					this.status = state.idle;
				}, 1000);
		}
		else if(event.otherCollider.node._name == 'enemy'){
			cc.math.Vec3.negate(this.direction,this.direction);
		}
	}
}
