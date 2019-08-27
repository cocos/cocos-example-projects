import { Con } from "./Constants";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

        //随机数决定产生哪个道具
        _RandomProps:0,

        //加攻击道具
        AttackPropsPrefab: {
            default:null,
            type:cc.Prefab
        },
        //加速度道具
        SpeedUpPropsPrefab: {
            default:null,
            type:cc.Prefab
        },
        //加射击速度道具
        ShootSpeedUpPropsPrefab: {
            default:null,
            type:cc.Prefab
        },
    },

    //实例化加攻击道具
    PrefabAttackProps:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newAttackProps = cc.instantiate(this.AttackPropsPrefab);
        scene.addChild(newAttackProps);
        newAttackProps.setPosition(this.node.getParent().getPosition().x,2,this.node.getParent().getPosition().z);
    },

    //实例化加速度道具
    PrefabSpeedUpProps:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newSpeedUpProps = cc.instantiate(this.SpeedUpPropsPrefab);
        scene.addChild(newSpeedUpProps);
        newSpeedUpProps.setPosition(this.node.getParent().getPosition().x,2,this.node.getParent().getPosition().z);
    },

    //实例化加射击速度道具
    PrefabShootSpeedUpProps:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newShootSpeedUpProps = cc.instantiate(this.ShootSpeedUpPropsPrefab);
        scene.addChild(newShootSpeedUpProps);
        newShootSpeedUpProps.setPosition(this.node.getParent().getPosition().x,2,this.node.getParent().getPosition().z);
    },
    // LIFE-CYCLE CALLBACKS:
     start() {
        Con.AlredyReProps=false;
     }, 

     update(dt){
         //检测场景里没有怪物了实例化道具
        if(cc.director.getScene().getChildByName('Monster')==null&&Con.AlredyReProps==false&&Con.AlreadyReMonster){
            this._RandomProps=cc.math.randomRangeInt(1,4);
            //产生加攻击道具 对应1
            if(this._RandomProps==1){
                this.PrefabAttackProps();
            }
            //产生加速度道具 对应2
            if(this._RandomProps==2){
                this.PrefabSpeedUpProps();
            }
            //产生加射击速度道具 对应3
            if(this._RandomProps==3){
                this.PrefabShootSpeedUpProps();
            }
            Con.AlredyReProps=true;
        }
     },
});
