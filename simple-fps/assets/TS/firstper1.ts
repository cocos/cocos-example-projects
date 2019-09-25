import { _decorator, Component, Vec3, systemEvent, SystemEvent, macro, game, math, director, SpriteComponent, AnimationComponent } from "cc";
const { ccclass} = _decorator;
import { Con } from './Constants';

@ccclass("firstper1")
export class firstper1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private _startLeft:boolean = false;
    private _startRight:boolean =false;
    private _startForward:boolean =false;
    private _startBackward:boolean =false;
    private _startJump:boolean =false;
    //跳跃检测
    private _ifJump:boolean =false;
    //跳跃计时
    private _jumptimer:number =0;
    //受伤计时
    private _Hittimer:number = 0;
    //失败计时
    private _Deltimmer:number = 0;

    private _sprite:any=null;

    private _animationComponent:any =null;

    private rigidbody:any=null;
    

    onLoad() {
        
        //键盘监听
        systemEvent.on(SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        
        //鼠标监听
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_MOVE,this.onMouseMove,this);
        
        //触摸监听
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE,this.onTouchMove,this);
        
     }

     onKeyUp(event){
        switch(event.keyCode) {
            case macro.KEY.a:
                Con.startLeft = false;
                break;
            case macro.KEY.d:
                Con.startRight = false;
                break;
            case macro.KEY.w:
                Con.startForward = false;
                break;
            case macro.KEY.s:
                Con.startBackward = false;
                break;
            case macro.KEY.space:
                Con.startJump=false;
                break;
        }
    }

    onKeyDown(event){
        switch(event.keyCode) {
            case macro.KEY.a:
                Con.startLeft = true;
                break;
            case macro.KEY.d:
                Con.startRight = true;
                break;
            case macro.KEY.w:
                Con.startForward = true;
                break;
            case macro.KEY.s:
                Con.startBackward = true;
                break;
            case macro.KEY.f:
                Con.RecoilSwitch =! Con.RecoilSwitch;
                break;
            case macro.KEY.space:
                Con.startJump=true;
                break;
        }
    }

    onMouseDown(event) {
        if (event.getButton() === 2) {
            game.canvas.requestPointerLock();
        } 
        if (event.getButton() === 0&&Con.PlayerHp>0&&Con.buttonevent==false) {
            Con.AniShoot=true;
        } 
    }

    onMouseUp(event){
        if (event.getButton() === 0&&Con.PlayerHp>0) {
        Con.AniShoot=false;
        }

        Con.isanirun=false;
        Con.isanijump=false;
        Con.isanishoot=false;
        Con.isaniidleshoot=false;
        Con.isanirunshoot=false;
        Con.isanijumpshoot=false;
    }

    onMouseMove(event){
        if(event.movementX!=0){
            const up =new Vec3(0,1,0);
            const rotationx = this.node.getRotation();
            math.Quat.rotateAround(rotationx, rotationx, up, -event.movementX/5/ 360.0 * 3.1415926535);
            this.node.setRotation(rotationx);
        }
    }
    
   
    onTouchMove(event){
        if(event.getDelta().x!=0){
            const up =new Vec3(0,1,0);
            const rotationx = this.node.getRotation();
            math.Quat.rotateAround(rotationx, rotationx, up, -event.getDelta().x/5/ 360.0 * 3.1415926535);
            this.node.setRotation(rotationx);
        }
    }

    start () {
        // Your initialization goes here.
        //获取血量组件
        const canvas = director.getScene().getChildByName('Canvas');
        const playerhp = canvas.getChildByName('PlayerHp');
        this._sprite = playerhp.getComponent(SpriteComponent);
        //获取动画组件
        this._animationComponent = this.node.getComponent(AnimationComponent);

    }

     update (deltaTime: number) {
        //处理按钮键鼠控制矛盾
        if(Con.startForward){
            this._startForward=true;
        }else{
            this._startForward=false;
        }
        if(Con.startRight){
            this._startRight=true;
        }else{
            this._startRight=false;
        }
        if(Con.startLeft){
            this._startLeft=true;
        }else{
            this._startLeft=false;
        }
        if(Con.startBackward){
            this._startBackward=true;
        }else{
            this._startBackward=false;
        }
        if(Con.startJump){
            this._startJump=true;
        }else{
            this._startJump=false;
        }
        this._sprite.fillRange=Con.PlayerHp/100;
        //血量为0限制行动
        if(Con.PlayerHp>0){
            if(this._startForward){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), -deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
        //开始跳跃锁运动
        if(this._ifJump==false){
            if(this._startLeft){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
            if(this._startRight){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), -deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
        
            if(this._startBackward){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
        }
        if(this._startJump&&this._ifJump==false){
            //只要按了跳跃 先让其他动画都等于false
            Con.AniJump=true;
            this._ifJump=true;
            const velocity = new cc.Vec3(0,Con.PlayerJump,0);
            math.Vec3.transformQuat(velocity,velocity,this.node.getWorldRotation());
            this.rigidbody=this.node.getComponent(cc.RigidBodyComponent);
            this.rigidbody.setLinearVelocity(velocity);
        }
        //跳跃动画管理
        if(this._ifJump){
            this._jumptimer+=1*deltaTime;
        }
        if(this._jumptimer>=1){
            Con.AniJump=false;
            Con.isanijump=false;
            Con.isanirun=false;
            this._ifJump=false;
            this._jumptimer=0;
            Con.isanijumpshoot=false;
            Con.isaniidleshoot=false;
            Con.isanirunshoot=false;
        }

        //如果没有按方向键就idle
        if(this._startBackward==false&&this._startForward==false&&this._startLeft==false&&this._startRight==false){
            if(Con.AniJump==false&&Con.PlayerHit==false){
                if(Con.Anirunshoottoidleshoot){
                    Con.isaniidleshoot=false;
                    Con.Anirunshoottoidleshoot=false;
                }
                Con.AniIdle=true;
                Con.AniRun=false;
                Con.isanirun=false;
            }
            if(Con.AniShoot==false&&Con.PlayerHit==false){
                Con.isanirun=false;
                Con.AniRun=false;
            }
        }
        //受伤开启受伤动画
        if(Con.PlayerHit){
            Con.AniHit=true;
            this._Hittimer+=1*deltaTime;
            //受伤后撤
            const position = this.node.getPosition();
            math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), deltaTime*Con.PlayerSpeed);
            this.node.setPosition(position);
        }
        if(this._Hittimer>0.4){
            Con.isanihit=false;
            Con.AniHit=false;
            Con.isanirun=false;
            Con.isanirunshoot=false;
            Con.isaniidleshoot=false;
            Con.PlayerHit=false;
            this._Hittimer=0;
        }
    }
       if(Con.PlayerHp<=0){
           Con.AniHit=false;
           Con.AniIdle=false;
           Con.AniJump=false;
           Con.AniShoot=false;
           this._animationComponent.stop("Hit", 0.0);
           Con.AniDel=true;
           this._Deltimmer+=1*deltaTime;
        }
        if(this._Deltimmer>0.8){
            game.pause();
        }
     }
     _getDirection(x, y, z) {
		const result = new Vec3(x, y, z);
		math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    }
}
