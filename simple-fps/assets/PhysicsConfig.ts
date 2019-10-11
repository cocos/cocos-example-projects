import { _decorator, Component, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PhysicsConfig")
export class PhysicsConfig extends Component {

    @property({ type: Node })
    envSprite: Node = null;

    start () {
        if (CC_PHYSICS_CANNON) {
            this.envSprite.active = false;

            director.loadScene('Sce1', null, null);
        } else {
            this.envSprite.active = true;
        }
    }

}
