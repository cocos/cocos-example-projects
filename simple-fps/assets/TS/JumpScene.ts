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
        AppearParPrefab: {
            default:null,
            type:cc.Prefab
        }, 
    },

    //实例化出现粒子效果
    PrefabAppearPar:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newAppearPar = cc.instantiate(this.AppearParPrefab);
        scene.addChild(newAppearPar);
        newAppearPar.setPosition(this.node.getPosition());
    },
    // LIFE-CYCLE CALLBACKS:
     start() {
        
     }, 
     update(dt){
        //场景跳转自身位置变化
       if(Con.JumpSwitch1){
            this.node.setPosition(0,2,-38);
            this.PrefabAppearPar();
            Con.JumpSwitch1=false;
        }
        if(Con.JumpSwitch2){
            this.node.setPosition(0,2,-88);
            this.PrefabAppearPar();
            Con.JumpSwitch2=false;
        }
        if(Con.JumpSwitchBoss1){
            this.node.setPosition(0,2,62);
            this.PrefabAppearPar();
            Con.JumpSwitchBoss1=false;
        }
     },
});
