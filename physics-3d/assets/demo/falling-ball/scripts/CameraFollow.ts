import { _decorator, Component, Node, director, Director, lerp } from "cc";
import { v3_t } from "./TempConst";
const { ccclass, property } = _decorator;

@ccclass("CameraFollow")
export class CameraFollow extends Component {

    @property({ type: Node })
    targetNode: Node = null;

    @property
    tolerance = 0.01;

    @property
    step = 0.1;

    private _offset = 0;

    start () {
        this._offset = this.node.worldPosition.y - this.targetNode.worldPosition.y;
    }

    lateUpdate () {
        const y = this.node.worldPosition.y;
        const ty = this.targetNode.worldPosition.y + this._offset;
        const delta = y - ty;
        if (delta > this.tolerance) {
            v3_t.set(this.node.worldPosition);
            v3_t.y = lerp(y, ty, this.step);
            this.node.worldPosition = v3_t;
        }
    }

    reset () {
        v3_t.set(this.node.worldPosition);
        v3_t.y = this.targetNode.worldPosition.y + this._offset;
        this.node.worldPosition = v3_t;
    }
}
