import { _decorator, Component, Node, Quat, ITriggerEvent, Material, ColliderComponent, ModelComponent } from "cc";
const { ccclass, property, menu } = _decorator;

const rot = Quat.fromEuler(new Quat(), 0, 2, 0);

@ccclass("BuiltinCapsuleTest")
@menu("physics/BuiltinCapsuleTest")
export class BuiltinCapsuleTest extends Component {

    @property({ type: Material })
    enterMat: Material = null;

    @property({ type: Material })
    exitMat: Material = null;

    start () {
        // Your initialization goes here.
        const collider = this.getComponent(ColliderComponent);
        if (collider) {
            collider.on('onTriggerEnter', this.onTrigger, this);
            collider.on('onTriggerStay', this.onTrigger, this);
            collider.on('onTriggerExit', this.onTrigger, this);
        }
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this.node.rotate(rot, 1);
    }

    onTrigger (event: ITriggerEvent) {
        if (event.type == 'onTriggerEnter') {
            const modelCom = event.otherCollider.node.getComponent(ModelComponent);
            if (modelCom) {
                modelCom.material = this.enterMat;
            }
        } else if (event.type == 'onTriggerExit') {
            const modelCom = event.otherCollider.node.getComponent(ModelComponent);
            if (modelCom) {
                modelCom.material = this.exitMat;
            }
        }
    }
}
