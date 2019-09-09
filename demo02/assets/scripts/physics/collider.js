
import { _decorator, Component, ModelComponent, RigidBodyComponent, Vec3, Vec4 } from "cc";
const { ccclass } = _decorator;

const v3_1 = new Vec3();
const static_color = new Vec4(0.3, 0.3, 0.3, 1.0);

@ccclass("Collider")
export class Collider extends Component {

    _body = null;
    _initialColor = null;
    _pass = null;
    _handle = 0;

    _color = new Vec4();

    start () {
        this._body = this.node.getComponent(RigidBodyComponent);
        const mat = this.node.getComponent(ModelComponent).material;
        // Vec4 and Color are compatible with each other, but Vec4 is more efficient when updated frequently
        this._initialColor = new Vec4(mat.getProperty('albedo'));
        this._pass = mat.passes[0];
        this._handle = this._pass.getHandle('albedo');
    }

    update () {
        // visualize speed
        this._body.getLinearVelocity(v3_1);
        let speed = v3_1.length(); speed /= speed + 1;
        Vec4.lerp(this._color, static_color, this._initialColor, speed);
        this._pass.setUniform(this._handle, this._color);
    }
}
