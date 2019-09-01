import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("rotor")
export class rotor extends Component {

    @property
    speed = 1;

    update (deltaTime) {
        const eu = this.node.eulerAngles;
        eu.y += deltaTime * this.speed;
        this.node.eulerAngles = eu;
    }
}
