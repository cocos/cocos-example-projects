import { _decorator, Component, Node, PhysicsSystem, Vec3 } from "cc";
const { ccclass, property } = _decorator;

/**
 * 简单的物理初始化，可以看作是代替物理配置面板
 */

@ccclass("PhysicsConfig")
export class PhysicsConfig extends Component {

    __preload () {
        PhysicsSystem.instance.maxSubStep = 5;
        PhysicsSystem.instance.gravity = new Vec3(0, -20, 0);
    }
}
