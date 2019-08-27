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
        //场景1
        Scene1Prefab: {
            default:null,
            type:cc.Prefab
        }, 
        //场景2
        Scene2Prefab: {
            default:null,
            type:cc.Prefab
        }, 

        //场景Boss1
        SceneBoss1Prefab: {
            default:null,
            type:cc.Prefab
        }, 
        //决定跳哪个场景
        _ChooseScene:0,
    },

    //实例化场景1
    PrefabScene1Prefab:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newScene1 = cc.instantiate(this.Scene1Prefab);
        scene.addChild(newScene1);
        newScene1.setPosition(0,0,-50);
    },

    //实例化场景2
    PrefabScene2Prefab:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newScene2 = cc.instantiate(this.Scene2Prefab);
        scene.addChild(newScene2);
        newScene2.setPosition(0,0,-100);
    },

    //实例化场景Boss1
    PrefabSceneBoss1Prefab:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newSceneBoss1 = cc.instantiate(this.SceneBoss1Prefab);
        scene.addChild(newSceneBoss1);
        newSceneBoss1.setPosition(0,0,50);
    },

    // LIFE-CYCLE CALLBACKS:
     start() {
        //触发事件
        var collider = this.node.getComponent(cc.ColliderComponent);
        collider.on('onTriggerEnter',this.onTrigger,this);
        Con.RepeatPotal=true;

     },
     update(dt){

     },
     onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'&&Con.RepeatPotal){
            //随机场景号
            this._ChooseScene = cc.math.randomRangeInt(1,3);
            //跳转开关
            if(this._ChooseScene==1&&Con.BossReSignal==false){
                this.PrefabScene1Prefab();
                Con.JumpSwitch1=true;
                //关闭传送门
                this.node.destroy();
            }
            if(this._ChooseScene==2&&Con.BossReSignal==false){
                this.PrefabScene2Prefab();
                Con.JumpSwitch2=true;
                //关闭传送门
                this.node.destroy();
            }
            //跳转Boss场景
            if(Con.BossReSignal){
                this.PrefabSceneBoss1Prefab();
                Con.JumpSwitchBoss1=true;
                //关闭传送门
                this.node.destroy();
            }
            //删除信号
            Con.DeleteTrap=true;
            Con.DeleteSignal=true;
            //避免重复生成传送门
            Con.RepeatPotal=false;
        }
    },  
});
