import { _decorator, Component, Node, CCFloat, Vec3 } from "cc";
const { ccclass, property } = _decorator;

let v3_a = new Vec3();
let v3_b = new Vec3();

@ccclass("CameraFollow")
export class CameraFollow extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: Node})
    public target: Node = null;
    @property({type: CCFloat})
    public smoothSpeed: number = 0.125;
    @property(Vec3)
    public offset: Vec3 = new Vec3();
    @property(Vec3)
    public lookAtOffset: Vec3 = new Vec3();

    start () {
        // Your initialization goes here.
    }

    lateUpdate (deltaTime: number) {
        // Your update function goes here.
        this.target.getWorldPosition(v3_a);
        Vec3.add(v3_b, v3_a, this.offset);
        Vec3.lerp(v3_b, this.node.position, v3_b, this.smoothSpeed);
        this.node.setWorldPosition(v3_b);

        Vec3.add(v3_a, v3_a, this.lookAtOffset);
        this.node.lookAt(v3_a);
    }
}