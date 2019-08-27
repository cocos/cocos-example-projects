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
        _recoil:false,
        _RecoilTime:0,
        _RecoilRange:0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad() {
        //鼠标监听
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_MOVE,this.onMouseMove,this);   
     },

    onMouseMove(event){
        if(event.movementY!=0){
        const right=cc.v3(-1,0,0);
        const rotationy = this.node.getRotation();
        cc.math.Quat.rotateAround(rotationy,rotationy,this._getDirection(-1, 0, 0), event.movementY/5/ 360.0 * 3.1415926535);
        this.node.setRotation(rotationy);
        }
    },

     start() {
         //没帧刷新，为了解决锁Y轴不及时的问题
        cc.director.getScheduler().scheduleUpdate(this, 0, false, this.Schedu);
     },
     update(dt) {
        //后坐力模拟
        if(Con.RecoilSwitch){
            if(this._recoil){
                this._RecoilTime+=1*dt;
            }
            if(this._RecoilTime>1){
                this._RecoilRange = cc.math.randomRange(-0.2,0.2);
                this.node.setRotation(this.node.getRotation().x+0.0005,this.node.getRotation().y+this._RecoilRange,this.node.getRotation().z,this.node.getRotation().w);
            }
            if(this._recoil==false){
                this._RecoilTime=0;
            }
        }
     //   this.node.setRotation(this.node.getRotation().x,this.node.getRotation().y,0,this.node.getRotation().w);
     },

     _getDirection(x, y, z) {
		const result = cc.v3(x, y, z);
		cc.math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    },
});