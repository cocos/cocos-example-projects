import { _decorator, Component, Node, ColliderComponent } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("mask-setup")
@menu("physics/mask-setup")
export class masksetup extends Component {

    @property
    public maskBit: number = 0;

    start () {
        // Your initialization goes here.
        let colliderCom = this.getComponent(ColliderComponent);
        if (colliderCom) {
            colliderCom.setMask(this.maskBit == -1 ? -1 : 1 << this.maskBit);
        }
    }

}
