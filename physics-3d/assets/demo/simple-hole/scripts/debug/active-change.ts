import { _decorator, Component, Node, profiler } from "cc";
import { ProfilerManager } from "../../../../common/scripts/ProfilerManager";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-HOLE.active-change")
@menu("demo/simple-hole/active-change")
export class activechange extends Component {

    @property({ type: Node })
    public targetNode: Node = null;

    start () {
        this.node.addComponent(ProfilerManager);
    }

    changeActive () {
        if (this.targetNode) {
            this.targetNode.active = !this.targetNode.active;
            if (profiler) {
                this.targetNode.active ? profiler.showStats() : profiler.hideStats();
            }
        }
    }
}
