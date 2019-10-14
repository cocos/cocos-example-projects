import { _decorator, Component, Node, PhysicsSystem, Vec3, profiler } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameConfig")
export class GameConfig extends Component {

    @property
    gravity_y = -20;

    @property
    maxSubStep = 1;

    @property
    deltaTime = 1 / 60;

    @property
    friction = 0;

    @property
    restitution = 0;

    @property
    showStat = false;

    // @property
    // lineheight = 8;

    onLoad () {
        PhysicsSystem.instance.gravity = new Vec3(0, this.gravity_y, 0);
        PhysicsSystem.instance.maxSubStep = this.maxSubStep;
        PhysicsSystem.instance.deltaTime = this.deltaTime;
        PhysicsSystem.instance.defaultMaterial.friction = this.friction;
        PhysicsSystem.instance.defaultMaterial.restitution = this.restitution;
    }

    start () {
        if (!this.showStat && !CC_BUILD) {
            setTimeout(() => {
                profiler.hideStats();
            }, 100);
        }
    }
}
