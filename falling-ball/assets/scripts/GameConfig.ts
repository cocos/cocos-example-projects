import { _decorator, Component, Node, PhysicsSystem, Vec3, profiler } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameConfig")
export class GameConfig extends Component {

    @property
    gravity_y = -20;

    @property
    maxSubStep = 10;

    @property
    deltaTime = 1 / 60;

    @property
    showStat = false;

    onLoad () {
        PhysicsSystem.instance.gravity = new Vec3(0, this.gravity_y, 0);
        PhysicsSystem.instance.maxSubStep = this.maxSubStep;
        PhysicsSystem.instance.deltaTime = this.deltaTime;
    }

    start () {
        if (!this.showStat && !CC_BUILD) {
            setTimeout(() => {
                profiler.hideStats();
            }, 100);
        }
    }
}
