import { _decorator, Component, ModelComponent, Vec4 } from "cc";
const { ccclass } = _decorator;

@ccclass("SSS")
export class SSS extends Component {

    _material = null;

    start () {
        this._material = this.node.getComponent(ModelComponent).material;
    }

    setSSSIntensity (e) {
        let value = this._material.getProperty('pbrParams');
        if (!value) { value = new Vec4(0.8, 0.6, 1, 1); }
        value.w = e.progress;
        this._material.setProperty('pbrParams', value);
    }
}
