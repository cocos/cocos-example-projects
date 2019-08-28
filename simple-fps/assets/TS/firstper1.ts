import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("NewScript")
export class NewScript extends Component {
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
        //跑步
    private _startRun:boolean =false;
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

    onLoad() {
        //键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        
        //鼠标监听
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_MOVE,this.onMouseMove,this);   
     }

     onKeyUp(event){
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this._startLeft = false;
                break;
            case cc.macro.KEY.d:
                this._startRight = false;
                break;
            case cc.macro.KEY.w:
                this._startForward = false;
                break;
            case cc.macro.KEY.s:
                this._startBackward = false;
                break;
            case cc.macro.KEY.space:
                this._startJump=false;
                break;
            case cc.macro.KEY.shift:
                this._startRun=false;
                break;
        }
    }

    onKeyDown(event){
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this._startLeft = true;
                break;
            case cc.macro.KEY.d:
                this._startRight = true;
                break;
            case cc.macro.KEY.w:
                this._startForward = true;
                break;
            case cc.macro.KEY.s:
                this._startBackward = true;
                break;
            case cc.macro.KEY.f:
                Con.RecoilSwitch =! Con.RecoilSwitch;
                break;
            case cc.macro.KEY.space:
                this._startJump=true;
                break;
            case cc.macro.KEY.shift:
                this._startRun=true;
                break;
        }
    }

    onMouseDown(event) {
        if (event.getButton() === 2) {
            cc.game.canvas.requestPointerLock();
        } 
        if (event.getButton() === 0) {
            Con.AniShoot=true;
        } 
    }

    onMouseUp(event){
        if (event.getButton() === 0) {
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
        const up =cc.v3(0,1,0);
        const rotationx = this.node.getRotation();
        cc.math.Quat.rotateAround(rotationx, rotationx, up, -event.movementX/5/ 360.0 * 3.1415926535);
        this.node.setRotation(rotationx);
        }
    }
    start () {
        // Your initialization goes here.
        cc.director.getScheduler().scheduleUpdate(this, 0, false, this.schedule);
        //获取血量组件
        const canvas = cc.director.getScene().getChildByName('Canvas');
        const playerhp = canvas.getChildByName('PlayerHp');
        this._sprite = playerhp.getComponent(cc.SpriteComponent);
        //获取动画组件
        this._animationComponent = this.node.getComponent(cc.AnimationComponent);
    }

     update (deltaTime: number) {
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
                cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), -deltaTime*Con.PlayerSpeed);
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
                cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
            if(this._startRight){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), -deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
        
            if(this._startBackward){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
                const position = this.node.getPosition();
                cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), deltaTime*Con.PlayerSpeed);
                this.node.setPosition(position);
            }
        }
        if(this._startJump){
            //只要按了跳跃 先让其他动画都等于false
            Con.AniJump=true;
            this._ifJump=true;
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,1,0), -deltaTime*Con.PlayerJump);
            this.node.setPosition(position);
        }
        //跳跃动画管理
        if(this._ifJump){
            this._jumptimer+=1*deltaTime;
        }
        if(this._jumptimer>=2){
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
            Con.isanirunshoot=false;
            Con.isaniidleshoot=false;
            this._Hittimer+=1*deltaTime;
            //受伤后撤
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), deltaTime*Con.PlayerSpeed);
            this.node.setPosition(position);
        }
        if(this._Hittimer>0.8){
            Con.isanihit=false;
            Con.AniHit=false;
            Con.isanirun=false;
            Con.isanirunshoot=false;
            Con.PlayerHit=false;
            this._Hittimer=0;
        }
    }
       //血量为0失败暂停，以后加上切换失败界面！！！！！！！！！！
       if(Con.PlayerHp<=0){
           Con.AniHit=false;
           Con.AniIdle=false;
           Con.AniJump=false;
           Con.AniShoot=false;
           this._animationComponent.stop("Hit", 0.0);
           Con.AniDel=true;
           this._Deltimmer+=1*deltaTime;
        }
        if(this._Deltimmer>2){
            cc.game.pause();
        }
     }
     _getDirection(x, y, z) {
		const result = cc.v3(x, y, z);
		cc.math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    }
}
