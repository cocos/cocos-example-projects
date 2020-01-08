import { _decorator, Component, ModelComponent, Vec4, Vec2 } from "cc";
const { ccclass } = _decorator;

@ccclass("Tunnel")
export class Tunnel extends Component {

    _passes = [];
    _colorHandles = [];
    _borderHandles = [];

    _color = new Vec4(1, 0, 0, 1);
    _border = new Vec2(0, 0);

    start () {
        const comps = this.getComponentsInChildren(ModelComponent);
        for (const comp of comps) {
            const mat = comp.material;
            const pass = mat.passes[0];
            this._colorHandles.push(pass.getHandle('color'));
            this._borderHandles.push(pass.getHandle('border'));
            this._passes.push(pass);
        }
    }

    update () {
        let time = cc.director.getTotalFrames() * 0.1;
        let margin = time % (Math.PI * 4) > Math.PI ? 0.1 : Math.abs(Math.cos(time)) * 0.1;
        this._color.y = this._color.z = margin * 10;
        this._border.x = this._border.y = margin;

        const len = this._passes.length;
        for (let i = 0; i < len; i++) {
            this._passes[i].setUniform(this._colorHandles[i], this._color);
            this._passes[i].setUniform(this._borderHandles[i], this._border);
        }
    }

    onDisable () {
		cc.eventManager.removeAllListeners();
	}
}
