import { _decorator, Component, Node, CharacterController, Vec2, Vec3, Input, EventKeyboard, 
    KeyCode, clamp, input, PhysicsSystem, CharacterControllerContact, Quat, EventTouch, BoxCharacterController } from 'cc';
const { ccclass, property, menu } = _decorator;
const v_3 = new Vec3();
const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v2_0 = new Vec2();
const rotation = new Quat();
const scale = new Vec3(1);

@ccclass('CharacterControllerTest')
export class CharacterControllerTest extends Component {
    @property
    public speed : number = 0.5;
    @property
    public gravityValue = -9.81;
    @property
    public jumpSpeed = 5;
    @property
    public linearDamping = 0.9;
    @property
    public pushPower = 4;

    private _cct : CharacterController = null!;
    private _control_z = 0;
    private _control_x = 0;
    private _movement = new Vec3(0,0,0);
    private _grounded = true;
    private _playerVelocity = new Vec3(0,0,0);
    private _doJump = true;
    private _hitPoint: Node = null!;

    jump() {
        if (this._grounded) {
            this._doJump = true;
        }
    }
    onLoad () {
        this._hitPoint = this.node.scene.getChildByName('HitPoint')!;

        this._cct = this.node.getComponent(CharacterController)!;
        if (this._cct) {
            this._cct.on('onControllerColliderHit', this.onControllerColliderHit, this);
        }
    }

    onEnable () {
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDisable () {
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onControllerColliderHit (hit: CharacterControllerContact){
        // console.log('Test onColliderHit');
        // console.log('selfCCT ', selfCCT.node.name, ' hitCollider ', hitCollider.node.name);
        // console.log('character velocity ', selfCCT.getVelocity());
        //selfCCT.detectCollisions = false;
        
        Quat.rotationTo(rotation, Vec3.UNIT_Y, hit.worldNormal);
        this._hitPoint.setWorldPosition(hit.worldPosition);
        scale.set(0.05, 1, 0.05);
        this._hitPoint.setWorldScale(scale);
        this._hitPoint.setWorldRotation(rotation);
        
        const body = hit.otherCollider.attachedRigidbody;
        // no rigidbody
        if (body == null || body.isKinematic) {
            return;
        }

        // We dont want to push objects below us
        if (hit.motionDirection.y < -0.1) {
            return;
        }

        // Calculate push direction from move direction,
        // we only push objects to the sides never up and down
        const pushDir = new Vec3(hit.motionDirection.x, 0, hit.motionDirection.z);

         // If you know how fast your character is trying to move,
        // then you can also multiply the push velocity by that.

        // Apply the push
        Vec3.multiplyScalar(pushDir, pushDir, this.pushPower);
        body.setLinearVelocity(pushDir);
    }

    onKeyDown (event: EventKeyboard) {
        this.keyProcess(event);
    }
    onKeyPressing (event: EventKeyboard) {
        this.keyProcess(event);
    }

    keyProcess (event: EventKeyboard) {
        const step = 1;
        switch(event.keyCode) {
            case KeyCode.KEY_W:{
                this._control_z += step;
                break;
            }
            case KeyCode.KEY_S:{
                this._control_z -= step;
                break;
            }
            case KeyCode.KEY_A:{
                this._control_x += step;
                break;
            }
            case KeyCode.KEY_D:{
                this._control_x -= step;
                break;
            }
            case KeyCode.SPACE:{
                this.jump();
                break;
            }
        }
        this._control_z = clamp(this._control_z, -1,1);
        this._control_x = clamp(this._control_x, -1,1);
    }

    onTouchMove (touch: Touch, event: EventTouch) {
        touch.getDelta(v2_0);
        const step = 1;
        if(Math.abs(v2_0.x) > 1)
            this._control_x -= step * Math.sign(v2_0.x);
        if(Math.abs(v2_0.y) > 1)
            this._control_z += step * Math.sign(v2_0.y);

        this._control_z = clamp(this._control_z, -1,1);
        this._control_x = clamp(this._control_x, -1,1);
    }

    onTouchEnd (touch: Touch, event: EventTouch) {
    }

    onResetPosition(){
        if(!this._cct) return;
        this._cct!.centerWorldPosition = new Vec3(-3,5,6);
    }
    update(deltaTime: number) {
        if(!this._cct) 
            return;

        deltaTime = PhysicsSystem.instance.fixedTimeStep;
        this._grounded = this._cct!.onGround;
        
        // Gravity
        this._playerVelocity.y += this.gravityValue * deltaTime;

        if (this._grounded) {
            if(this._doJump){
                this._playerVelocity.y += this.jumpSpeed;
                this._doJump = false;
            }
            else{
                //control impulse
                this._playerVelocity.z += -this._control_z * this.speed;
                this._playerVelocity.x += -this._control_x * this.speed;
                this._control_z = 0;
                this._control_x = 0;

                // damping
                this._playerVelocity.x *= this.linearDamping;
                this._playerVelocity.z *= this.linearDamping;

                //grounded
                this._playerVelocity.y = 0;
            }
        }

        Vec3.multiplyScalar(this._movement, this._playerVelocity, deltaTime);
        this._cct!.move(this._movement);
    }
}


