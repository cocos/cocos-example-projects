// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import JellyFish from './jellyfish' ;

cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        count: 30,
        range: 30
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
        for (let i = 0; i < this.count; ++i) {
            setTimeout(() => {
                if (!this.prefab) { return; }
                let node = cc.instantiate(this.prefab);
                node.getComponent(JellyFish).range = this.range;
                this.node.addChild(node);
            }, Math.random() * 3000);
        }
    },
});
