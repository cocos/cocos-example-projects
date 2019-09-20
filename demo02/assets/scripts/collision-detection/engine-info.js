
import { _decorator, Component, LabelComponent } from "cc";
const { ccclass } = _decorator;

@ccclass("EngineInfo")
export class EngineInfo extends Component {

    start () {
        let engine = 'Unknown Physics Engine';
        if (CC_PHYSICS_BUILTIN) engine = 'Built-in Collision Detection Engine';
        else if (CC_PHYSICS_CANNON) engine = 'Cannon.js Physics Engine';
        else if (CC_PHYSICS_AMMO) engine = 'Ammo.js Physics Engine';
        this.node.getChildByName('EngineInfo').getComponent(LabelComponent).string = `${engine}\nYou can change this in the project settings menu`;
    }
}
