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

        //控制射击速度
        _timer:0,
        //持续射击
        _ifcontinuous:false,

        BulletPrefab: {
            default:null,
            type:cc.Prefab
        },
    },

    //实例化子弹
    PrefabBullet:function(){
        const Player = this.node.getWorldPosition();
        var scene = cc.director.getScene();
        var newBullet = cc.instantiate(this.BulletPrefab);
        scene.addChild(newBullet);
        newBullet.setPosition(Player.x,Player.y,Player.z);
    },

    onMouseDown(event) {
        if (event.getButton() === 0&&this._timer>Con.Shoootinterval) {
            this.PrefabBullet();
            this._ifcontinuous=true;
            this._timer=0;
        } 
    },

    onMouseUp(event){
        if (event.getButton() === 0) {
            this._ifcontinuous=false;
        } 
    },
    // LIFE-CYCLE CALLBACKS:
     onLoad() {
        //鼠标监听
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);   
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_UP,this.onMouseUp,this);     
     },
     start(){
     //   this.PrefabShooter();
     },

     update(dt){      
         this._timer +=1*dt;
         
         //持续射击
         if(this._ifcontinuous==true&&this._timer>Con.Shoootinterval){
            this.PrefabBullet();
            this._timer=0;
         }
     }
    
});
