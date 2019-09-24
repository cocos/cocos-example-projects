import { _decorator, Component, Node, PhysicsSystem } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PhysicsConfig")
export class PhysicsConfig extends Component {

    __preload () {
        PhysicsSystem.instance.maxSubStep = 20;
    }
}
