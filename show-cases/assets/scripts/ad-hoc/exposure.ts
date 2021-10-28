import { _decorator, Component, Node, Scene, renderer, SliderComponent, CameraComponent, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Exposure')
export class Exposure extends Component {

    private _ambient: renderer.scene.Ambient = null!;
    private _camera: renderer.scene.Camera = null!;

    start () {
        const scene = this.node.scene as Scene;
        const pipeline = director.root!.pipeline;
        this._ambient = pipeline.pipelineSceneData.ambient;
        this._camera = scene.getComponentInChildren(CameraComponent)!.camera;
    }

    setSkyIllumination (e: SliderComponent) {
        this._ambient.skyIllum = Math.pow(2, e.progress * 30.46); // default illum 38400, at progress 0.5
    }

    setExposure (e: SliderComponent) {
        this._camera.aperture = Math.floor((1 - e.progress) * 22.99); // defaul aperture F16, at progress 0.17
    }
}
