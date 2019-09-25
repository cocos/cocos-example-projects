import { _decorator, Component, Node, ModelComponent, Vec4 } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;
const _v4_0 = new Vec4();

@ccclass("CurvePlane")
@executeInEditMode
export class CurvePlane extends Component {

    @property({ type: ModelComponent })
    public modelComp: ModelComponent = null;

    @property({ type: Node })
    public cameraNode: Node = null;

    @property
    public magni = 0.01;

    update (deltaTime: number) {
        const wp = this.cameraNode.worldPosition;
        _v4_0.set(wp.x, wp.y, wp.z, this.magni);
        this.modelComp.material.setProperty('factor', _v4_0);
    }
}
