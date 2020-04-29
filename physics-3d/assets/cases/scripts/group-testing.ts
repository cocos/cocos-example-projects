import { _decorator, Component, ColliderComponent, RigidBodyComponent } from "cc";
import { PHY_GROUP, PHY_MASK } from "./group-mask";
const { menu, ccclass, property } = _decorator;

@ccclass("grouptesting")
@menu("physics/grouptesting")
export class grouptesting extends Component {

    @property({ type: PHY_GROUP })
    phy_group0 = 0;

    @property({ type: PHY_GROUP })
    phy_group1 = 0;

    public start () {
        let rigidBody = this.getComponent(RigidBodyComponent);
        if (rigidBody) {
            rigidBody.allowSleep = false;
        }
    }

    public switchGroup () {
        let collider = this.getComponent(ColliderComponent);
        if (collider) {
            if (collider.getGroup() == this.phy_group0) {
                collider.setGroup(this.phy_group1);
            } else {
                collider.setGroup(this.phy_group0);
            }
        }
    }
}
