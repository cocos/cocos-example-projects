import { _decorator, Component, Node, profiler } from "cc";
const { ccclass, property } = _decorator;

@ccclass("active-change")
export class activechange extends Component {

    @property({ type: Node })
    public targetNode: Node = null;

    changeActive () {
        if (this.targetNode) {
            this.targetNode.active = !this.targetNode.active;
            if (this.targetNode.active) {
                profiler.showStats();
            } else {
                profiler.hideStats();
            }

        }
    }
}
