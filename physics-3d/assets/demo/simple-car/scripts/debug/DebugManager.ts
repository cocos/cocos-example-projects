import { _decorator, Component, Node, game, EventTouch } from "cc";
import { InstanceMgr } from "../gameplay/InstanceMgr";
const { ccclass, property } = _decorator;

@ccclass("DebugManager")
export class DebugManager extends Component {

    onLoad () {
        // Your initialization goes here.
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        game.addPersistRootNode(this.node);

        InstanceMgr.registerInstance('DebugManager', this);
    }

    public changeActive (event: EventTouch, name: string) {
        const n = this.node.getChildByName(name);
        if (n) {
            n.active = !n.active;
        }
    }

}
