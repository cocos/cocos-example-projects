import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("disable-onload")
export class disableonload extends Component {

    @property
    public state: boolean = false;

    @property({ type: Node })
    public target: Node = null;

    __preload () {
        this.target.active = this.state;
    }
}
