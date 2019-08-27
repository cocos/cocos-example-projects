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
        Portal1Prefab: {
            default:null,
            type:cc.Prefab
        },

    },

    //实例化传送门
    PrefabPortal1:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newPortal1 = cc.instantiate(this.Portal1Prefab);
        scene.addChild(newPortal1);
        newPortal1.setPosition(this.node.getParent().getPosition().x+10,2,this.node.getParent().getPosition().z-12);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){

    },

     start() {

     },

     update(dt) {      
         //检测场景里没有怪物了实例化传送门
        if(cc.director.getScene().getChildByName('Monster')==null&&Con.AlreadyReMonster){
            this.PrefabPortal1();
            //注意这里和Fportal中重复考虑删除
            Con.AlredyReProps=true;
            if(Con.AlredyReProps){
            Con.AlreadyReMonster=false;
            }
        }
     },
});
