import { _decorator, Component, Node, RenderStage, RenderFlow, RenderView } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlanarReflectionStage")
export class PlanarReflectionStage extends RenderStage {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    render (view: RenderView) {
        // Your update function goes here.
        this.sortRenderQueue();
        this._framebuffer = this.flow.pipeline.getFrameBuffer('reflect');
        this.executeCommandBuffer(view);
    }

    public resize (width: number, height: number) {

    }
}
