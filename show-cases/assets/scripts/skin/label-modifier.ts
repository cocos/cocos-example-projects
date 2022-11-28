import { _decorator, Component, LabelComponent, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelModifier')
export class LabelModifier extends Component {

    @property
    public prefix = '';

    public _label = null;

    public start () {
        this._label = this.node.getComponent(LabelComponent);
    }

    public setStringBySliderValue (e: Slider) {
        if (this._label) { this._label.string = this.prefix + e.progress.toFixed(2); }
    }
}
