import { _decorator, Component, Node, Scene, renderer, SliderComponent, CameraComponent, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Exposure')
export class Exposure extends Component {

    private _ambient: renderer.Ambient;
    private _camera: renderer.Camera;

    start () {
        const scene = this.node.scene as Scene;
        const pipeline = director.root.pipeline;
        this._ambient = pipeline.ambient;
        this._camera = scene.getComponentInChildren(CameraComponent).camera;
    }

    setSkyIllumination (e: SliderComponent) {
        this._ambient.skyIllum = Math.pow(2, e.progress * 30.46); // default illum 38400, at progress 0.5
    }

    setExposure (e: SliderComponent) {
        // @ts-ignore
        this._camera._exposure = Math.pow(2, (e.progress - 1) * 30.46); // defaul exposure 1/38400, at progress 0.5
    }
}
