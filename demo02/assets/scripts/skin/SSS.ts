import { _decorator, Component, ModelComponent } from "cc";
const { ccclass } = _decorator;

@ccclass("SSS")
export class SSS extends Component {

    _handle = null;

    start () {
        const mat = this.node.getComponent(ModelComponent).material;
        this._pass = mat.passes[0];
        this._handle = this._pass.getHandle('scattering');
    }

    setSSSIntensity (e) {
        this._pass.setUniform(this._handle, e.progress);
    }

    toggle (e) {
        this.node.active = e.isChecked;
    }
}
