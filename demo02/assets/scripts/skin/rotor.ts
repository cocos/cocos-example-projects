import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Rotor')
export class Rotor extends Component {

    @property
    public speed = 1;

    public update (deltaTime: number) {
        const eu = this.node.eulerAngles;
        this.node.setRotationFromEuler(eu.x, eu.y + deltaTime * this.speed, eu.z);
    }
}
