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
        range: 10
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let x = Math.random() * this.range - this.range/2;
        let y = 10 + Math.random() * 10 - 10/2;
        let z = Math.random() * this.range - this.range/2;
        this.node.setPosition(x, y, z);
    },

    // start() {},

    // update(dt) {},
});
