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
        // 计时器 label 的引用
        timeDisplay: {
            default: null,
            type: cc.Node
        }, 
        duration:30,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        this.reset = this.duration;
    },

    update(dt) {
        const target = this.node.getComponent('target');
        this.duration -= dt;
        this.timeDisplay.getComponent(cc.LabelComponent).string = 'Timer: ' + Math.floor(this.duration);
        
        if(target.isWin()) {
            this.timeDisplay.getComponent(cc.LabelComponent).string = "You Win !!!";
        }
        else if(this.duration < 0) {
            this.timeDisplay.getComponent(cc.LabelComponent).string = "Time up!";
        }

        if(this.duration < 0 || target.isWin()) {
            console.log('reload');

            const scene = this.node.scene;
            const canvas = scene.getChildByName('Canvas');
            const play = canvas.getChildByName('play');
           
            play.active = true;
            // cc.director.pause();
            cc.game.pause();
            console.log(play);
            play.on('click',this._onClick,this); 
        }

    },

    _onClick(){ 
        this.duration = this.reset;
        const scene = this.node.scene;
        const canvas = scene.getChildByName('Canvas');
        const play = canvas.getChildByName('play');
        const target = this.node.getComponent('target');
        //cc.director.resume();
        cc.game.resume();
        target.reStart();
        play.active = false;
    }
});
