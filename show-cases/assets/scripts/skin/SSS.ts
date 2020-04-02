import { _decorator, Component, ModelComponent, SliderComponent, ToggleComponent } from 'cc';
const { ccclass } = _decorator;

@ccclass('SSS')
export class SSS extends Component {

    private _handle = null;
    private _pass = null;

    public start () {
        const mat = this.node.getComponent(ModelComponent).material;
        this._pass = mat.passes[0];
        this._handle = this._pass.getHandle('scattering');
    }

    public setSSSIntensity (e: SliderComponent) {
        this._pass.setUniform(this._handle, e.progress);
    }

    public toggle (e: ToggleComponent) {
        this.node.active = e.isChecked;
    }
}
