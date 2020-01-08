
import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

const sineLerp = (b, e, t) => {
    return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
};

@ccclass("PhysicsGround")
export class PhysicsGround extends Component {

    @property
    spinDuration = 5;
    @property
    spinInterval = 20;

    @property(Node)
    manualSpinSliderNode = null;

    _time = 0;
    _angle = 0;
    _autoSpin = true;

    update (deltaTime) { // spin once in a while
        if (this._autoSpin) {
            this._time += deltaTime;
            const t = Math.min(this.spinInterval - (this._time % this.spinInterval), this.spinDuration);
            const back = Math.floor(this._time / this.spinInterval) % 2;
            this._angle = sineLerp(back ? 0 : 180, back ? 180 : 0, t / this.spinDuration);
        }
        this.node.setRotationFromEuler(0, 0, this._angle);
    }

    // toggle callback
    toggleSpin (e) {
        this._autoSpin = e.isChecked;
        this.manualSpinSliderNode.active = !e.isChecked;
    }

    // slider callback
    setAngle (e) {
        this._angle = (0.5 - e.progress) * 180;
    }
}
