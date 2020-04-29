import { _decorator, Component, LabelComponent } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("PhyicsTitle")
@menu("physics/PhyicsTitle")
export class PhyicsTitle extends Component {

    start () {
        // Your initialization goes here.
        let label = this.getComponent(LabelComponent);
        if (label) {
            if (CC_PHYSICS_BUILTIN) {
                label.string = '物理：builtin';
            } else if (CC_PHYSICS_CANNON) {
                label.string = '物理：cannon';
            } else if (CC_PHYSICS_AMMO) {
                label.string = '物理：ammo';
            }
        }
    }

}
