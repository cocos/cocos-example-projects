// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { Con } from './Constants';
cc.Class({
    extends: cc.Component,


    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        MoveSpeed:0,   

        _recoil:false,
        _RecoilTime:0,
        _RecoilRange:0,

        _startLeft:false,
        _startRight:false,
        _startForward:false,
        _startBackward:false,
        //跑步
        _startRun:false,

        //跳跃检测
        _ifJump:false,
        //跳跃计时
        _jumptimer:0,

        //受伤计时
        _Hittimer:0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad() {
        //键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        
        //鼠标监听
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_MOVE,this.onMouseMove,this);   
     },

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
    },

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
    },


    onMouseDown(event) {
        if (event.getButton() === 2) {
            cc.game.canvas.requestPointerLock();
        } 
        if (event.getButton() === 0) {
            //后坐力
            this._recoil=true;
            Con.AniShoot=true;
        } 
    },

    onMouseUp(event){
        if (event.getButton() === 0) {
        this._recoil=false;
        Con.AniShoot=false;
        }

        Con.isanirun=false;
        Con.isanijump=false;
        Con.isanishoot=false;
        Con.isaniidleshoot=false;
        Con.isanirunshoot=false;
        Con.isanijumpshoot=false;
    },

    onMouseMove(event){
        if(event.movementX!=0){
        const up =cc.v3(0,1,0);
        const rotationx = this.node.getRotation();
        cc.math.Quat.rotateAround(rotationx, rotationx, up, -event.movementX/5/ 360.0 * 3.1415926535);
        this.node.setRotation(rotationx);
        }
    },

     start() {
         //没帧刷新，为了解决锁Y轴不及时的问题
        cc.director.getScheduler().scheduleUpdate(this, 0, false, this.Schedu);
     },
     update(dt) {
         if(this._startForward){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), -dt*Con.PlayerSpeed);
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
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), dt*Con.PlayerSpeed);
            this.node.setPosition(position);
        }
        if(this._startRight){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), -dt*Con.PlayerSpeed);
            this.node.setPosition(position);
        }
        
        if(this._startBackward){
                Con.AniRun=true;
                if(Con.Aniidleshoottorunshoot){
                    Con.isanirunshoot=false;
                    Con.Aniidleshoottorunshoot=false;
                }
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), dt*Con.PlayerSpeed);
            this.node.setPosition(position);
        }
    }
        if(this._startJump){
            //只要按了跳跃 先让其他动画都等于false
            Con.AniJump=true;
            this._ifJump=true;
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,1,0), -dt*Con.PlayerJump);
            this.node.setPosition(position);
        }
        //跳跃动画管理
        if(this._ifJump){
            this._jumptimer+=1*dt;
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
            this._Hittimer+=1*dt;
            //受伤后撤
            const position = this.node.getPosition();
            cc.math.Vec3.scaleAndAdd(position, position, this._getDirection(0,0,-1), dt*Con.PlayerSpeed);
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
       //血量为0失败暂停，以后加上切换失败界面！！！！！！！！！！
       if(Con.PlayerHp<=0){
         //  Con.AniDel=true;
         //  cc.game.pause();
        }
     },

     _getDirection(x, y, z) {
		const result = cc.v3(x, y, z);
		cc.math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    },
});
