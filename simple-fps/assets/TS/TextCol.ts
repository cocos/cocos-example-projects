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
        _text:null,
    },

   
    // LIFE-CYCLE CALLBACKS:
     start() {
        this._text = this.node.getComponent(cc.LabelComponent);
        this._text.onEnable=false;
     },
     update(dt){
        this._text.string="玩家血量："+Con.PlayerHp+"\n"+"子弹伤害："+Con.BulletD+"\n"+"奔跑速度："+Con.PlayerSpeed+"\n"+"射击速度："+Con.Shoootinterval+"\n"+"当前层数："+Con._AtLevel+"\n"+"射击模式："+Con.RecoilSwitch;
     }, 
});
