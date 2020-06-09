import { _decorator, Component, Node } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-HOLE.disable-onload")
@menu("demo/simple-hole/disable-onload")
export class disableonload extends Component {

    @property
    public state: boolean = false;

    @property({ type: Node })
    public target: Node = null;

    /** __preload/onLoad 的时候不要去改变其它节点激活状态，否则会破坏遍历树 */
    start () {
        this.target.active = this.state;
    }
}
