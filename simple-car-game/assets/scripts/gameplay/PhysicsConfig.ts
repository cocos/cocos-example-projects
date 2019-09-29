import { _decorator, Component, Node, PhysicsSystem, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PhysicsConfig")
export class PhysicsConfig extends Component {

    __preload () {
        PhysicsSystem.instance.maxSubStep = 5;
        PhysicsSystem.instance.gravity = new Vec3(0, -20, 0);
    }
}
