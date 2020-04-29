import { _decorator, Component, Node, PhysicsSystem, Vec3, profiler } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FALLING-BALL.GameConfig")
export class GameConfig extends Component {

    @property
    allowSleep = true;

    @property
    gravity = new Vec3(0, -20, 0);

    @property
    maxSubStep = 1;

    @property
    frameRate = 60;

    @property
    friction = 0;

    @property
    restitution = 0;

    @property
    showStat = false;

    __preload () {
        PhysicsSystem.instance.allowSleep = this.allowSleep;
        PhysicsSystem.instance.gravity = this.gravity;
        PhysicsSystem.instance.maxSubStep = this.maxSubStep;
        PhysicsSystem.instance.deltaTime = this.frameRate == 0 ? 1E+100 : 1 / this.frameRate;
        PhysicsSystem.instance.defaultMaterial.friction = this.friction;
        PhysicsSystem.instance.defaultMaterial.restitution = this.restitution;
    }

    start () {
        if (!this.showStat && !window.CC_BUILD) {
            setTimeout(() => {
                if (profiler) profiler.hideStats();
            }, 100);
        }
    }
}
