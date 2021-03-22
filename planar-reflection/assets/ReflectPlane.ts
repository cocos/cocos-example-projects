import { _decorator, Component, director, Vec3 } from "cc";
import { PlanarReflectionFlow } from "./PlanarReflectionFlow";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("ReflectPlane")
@executeInEditMode
export class ReflectPlane extends Component {

    @property
    localNormal = new Vec3(0, 1, 0);

    _flow: PlanarReflectionFlow = null!;

    start () {
        // this._flow = director.root.pipeline.getFlow('PlanarReflect') as PlanarReflectionFlow;
    }

    update () {
        // this._flow.setPlaneFromNode(0, this.node, this.localNormal);
    }
}
