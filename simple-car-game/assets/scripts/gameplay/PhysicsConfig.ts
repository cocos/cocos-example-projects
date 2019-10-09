import { _decorator, Component, Node, PhysicsSystem, Vec3, director } from "cc";
const { ccclass, property } = _decorator;

/**
 * 简单的物理初始化，可以看作是代替物理配置面板
 */

@ccclass("PhysicsConfig")
export class PhysicsConfig extends Component {

    @property({ type: Node })
    physicsEnv: Node = null;

    @property
    maxSubStep: number = 5;

    @property({ type: Vec3 })
    gravity: Vec3 = new Vec3(0, -20, 0);

    __preload () {
        if (CC_PHYSICS_CANNON) {
            this.physicsEnv.active = false;

            /** 设置物理配置 */
            PhysicsSystem.instance.maxSubStep = this.maxSubStep;
            PhysicsSystem.instance.gravity = this.gravity;

            /** 加载主场景 */
            director.loadScene('main', null, null);
        } else {
            this.physicsEnv.active = true;
        }
    }
}
