import { _decorator, CameraComponent, Color, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sponza')
export class Sponza extends Component {

    @property
    public loopTime = 3600;

    @property
    public maxIllum = 20000;

    private ambient: any;
    private halfLoopTime = 0;
    private camera: CameraComponent;
    private color = new Color();

    public start () {
        this.ambient = director.root.pipeline.pipelineSceneData.ambient;
        this.halfLoopTime = this.loopTime * 0.5;
        this.camera = this.node.getComponent(CameraComponent);
    }

    public update (deltaTime: number) {
        let illum = 0;
        const t = director.getTotalFrames() % this.loopTime;
        if (t > this.halfLoopTime) { illum = Math.sin((t - this.halfLoopTime) / this.halfLoopTime * Math.PI); }
        this.ambient.skyIllum = illum * this.maxIllum;
        this.color.r = this.color.g = this.color.b = illum * 255;
        this.camera.clearColor = this.color;
    }
}
