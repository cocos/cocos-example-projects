
import { _decorator, Component, Node, Slider, Toggle } from 'cc';
const { ccclass, property } = _decorator;

const sineLerp = (b: number, e: number, t: number) => {
    return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
};

@ccclass('PhysicsGround')
export class PhysicsGround extends Component {

    @property
    public spinDuration = 5;
    @property
    public spinInterval = 20;

    @property(Node)
    public manualSpinSliderNode = null;

    public _time = 0;
    public _angle = 0;
    public _autoSpin = true;

    public update (deltaTime: number) { // spin once in a while
        if (this._autoSpin) {
            this._time += deltaTime;
            const t = Math.min(this.spinInterval - (this._time % this.spinInterval), this.spinDuration);
            const back = Math.floor(this._time / this.spinInterval) % 2;
            this._angle = sineLerp(back ? 0 : 180, back ? 180 : 0, t / this.spinDuration);
        }
        this.node.setRotationFromEuler(0, 0, this._angle);
    }

    // toggle callback
    public toggleSpin (e: Toggle) {
        this._autoSpin = e.isChecked;
        this.manualSpinSliderNode.active = !e.isChecked;
    }

    // slider callback
    public setAngle (e: Slider) {
        this._angle = (0.5 - e.progress) * 180;
    }
}
