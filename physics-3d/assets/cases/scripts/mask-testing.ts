import { _decorator, Component, ColliderComponent } from "cc";
import { PHY_MASK } from "./group-mask";
const { menu, ccclass, property } = _decorator;

@ccclass("mask-testing")
@menu("physics/mask-testing")
export class masktesting extends Component {

    @property({ type: PHY_MASK })
    phy_mask0 = 0;

    @property({ type: PHY_MASK })
    phy_mask1 = 0;

    switchMask () {
        let collider = this.getComponent(ColliderComponent);
        if (collider) {
            if (collider.getMask() == this.phy_mask0) {
                collider.setMask(this.phy_mask1);
            } else {
                collider.setMask(this.phy_mask0);
            }
        }
    }
}
