// @ts-check

import { _decorator, Component, Node, AudioSourceComponent, Director, director } from 'cc';

@_decorator.ccclass('audio')
export class Audio extends Component {
    @_decorator.type(Node)
    node1 = null;

    @_decorator.type(Node)
    node2 = null;

    start() {
        const source = this.node1.getComponent(AudioSourceComponent);
        const source2 = this.node2.getComponent(AudioSourceComponent);

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
        let startTime1, startTime2;
        const sineLerp = (b, e, t) => {
          return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
        };
        const animation1 = () => {
          source.volume = sineLerp(1, 0.1, (performance.now() - startTime1) / (t1 * 1000));
        };
        const animation2 = () => {
          source2.volume = sineLerp(0.5, 1, (performance.now() - startTime2) / (t2 * 1000));
        };
        source.clip.once('started', () => {
          // animate audio 1
          const s2 = source2;
          startTime1 = performance.now();
          director.on(Director.EVENT_BEFORE_UPDATE, animation1);
          setTimeout(() => {
            director.off(Director.EVENT_BEFORE_UPDATE, animation1);
          }, t1 * 1000);
          // animate audio 2
          setTimeout(() => {
            s2.play();
            startTime2 = performance.now();
            director.on(Director.EVENT_BEFORE_UPDATE, animation2);
          }, off2 * 1000);
          setTimeout(() => {
            director.off(Director.EVENT_BEFORE_UPDATE, animation2);
          }, (off2 + t2) * 1000);
        });
        /**/
    }

    onDisable () {
        this.node1.getComponent(AudioSourceComponent).stop();
        this.node2.getComponent(AudioSourceComponent).stop();
      }
}
