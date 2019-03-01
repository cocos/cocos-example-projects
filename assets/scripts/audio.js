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
        node1: {
            default: null,
            type: cc.Node
        },
        node2: {
            default: null,
            type: cc.Node
        }
    },

    start () {
        const source = this.node1.getComponent(cc.AudioSourceComponent);
        const source2 = this.node2.getComponent(cc.AudioSourceComponent);

        let t1 = 17, off2 = 5, t2 = 15;
        /* discrete callbacks *
        source.clip.once('started', () => {
          setTimeout(function(){ source.volume = 0.55; }, t1 * 500);
          setTimeout(function(){ source.volume = 0.1; }, t1 * 1000);

          setTimeout(function(){ source2.play(); }, off2 * 1000);
          setTimeout(function(){ source2.volume = 0.75; }, (off2 + t2 * 0.5) * 1000);
          setTimeout(function(){ source2.volume = 1; }, (off2 + t2) * 1000);
        });
        /* smooth transition */
        let startTime = cc.director.getTotalFrames();
        const sineLerp = (b, e, t) => {
          return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
        };
        const animation1 = () => {
          source.volume = sineLerp(1, 0.1, (cc.director.getTotalFrames() - startTime) / t1 / 60);
        };
        const animation2 = () => {
          source2.volume = sineLerp(0.5, 1, (cc.director.getTotalFrames() - startTime - off2) / t2 / 60);
        };
        source.clip.once('started', () => {
          // animate audio 1
          startTime = cc.director.getTotalFrames();
        //   setActive(volumes[0], false);
          cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, animation1);
          setTimeout(() => {
            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, animation1);
            // setActive(volumes[0], true);
          }, t1 * 1000);
          // animate audio 2
          setTimeout(() => {
            source2.play();
            // setActive(volumes[1], false);
            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, animation2);
          }, off2 * 1000);
          setTimeout(() => {
            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, animation2);
            // setActive(volumes[1], true);
          }, (off2 + t2) * 1000);
        });
        /**/
    },

    // update(dt) {},
});
