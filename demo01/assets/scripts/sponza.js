import { _decorator, Component, CameraComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Sponza")
export class Sponza extends Component {

    @property
    loopTime = 3600;

    @property
    maxIllum = 20000;

    start () {
        this.ambient = this.node.scene.renderScene.ambient;
        this.halfLoopTime = this.loopTime * 0.5;
        this.camera = this.node.getComponent(CameraComponent);
        this.color = cc.color();
    }

    update (deltaTime) {
        let illum = 0;
        const t = cc.director.getTotalFrames() % this.loopTime;
        if (t > this.halfLoopTime) illum = Math.sin((t - this.halfLoopTime) / this.halfLoopTime * Math.PI);
        this.ambient.skyIllum = illum * this.maxIllum;
        this.color.r = this.color.g = this.color.b = illum * 255;
        this.camera.color = this.color;
    }
}
