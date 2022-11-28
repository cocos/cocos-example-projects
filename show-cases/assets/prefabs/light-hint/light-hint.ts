import { _decorator, Component, CameraComponent, Material, ModelComponent, SpotLightComponent, SphereLightComponent, Vec2, Vec4 } from "cc";
const { ccclass } = _decorator;

@ccclass("LightHint")
export class LightHint extends Component {

    private _material: Material = null;
    private _camera: CameraComponent = null;

    start () {
        let light: SphereLightComponent | SpotLightComponent = this.node.parent.getComponent(SphereLightComponent);
        if (!light) light = this.node.parent.getComponent(SpotLightComponent);
        this._material = this.node.getComponent(ModelComponent).material;
        this._camera = this.node.scene.getComponentInChildren(CameraComponent);
        const size = light.size * 4;
        this.node.setWorldScale(size, size, size);
        this._material.setProperty('mainColor', light.color);
        this._material.setProperty('intensitySize', new Vec4(light.luminance, 0.4, 0, 0));
    }

    update () {
        this.node.setWorldRotation(this._camera.node.worldRotation);
    }
}
