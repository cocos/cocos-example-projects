import { _decorator, Component, LabelComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LabelModifier")
export class LabelModifier extends Component {

    @property
    prefix = '';

    _label = null;

    start () {
        this._label = this.node.getComponent(LabelComponent);
    }

    setStringBySliderValue (e) {
        if (this._label) { this._label.string = this.prefix + e.progress.toFixed(2); }
    }
}
