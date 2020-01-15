import { _decorator, Component, Node, Layers, director } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("ReflectPlane")
@executeInEditMode
export class ReflectPlane extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({
        type: Node,
    })
    camera = null;

    start () {
        Layers.addLayer('reflect', 1);
        this.node.layer = Layers.BitMask['reflect'];
        this.camera.visibility |= this.node.layer;
        (director.root.pipeline.getFlow('PlanarReflect') as PlanarReflectionFlow).reflectNode = this.node;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
