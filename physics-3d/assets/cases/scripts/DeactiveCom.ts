import { _decorator, Component, Node, Enum } from "cc";
const { ccclass, property, menu } = _decorator;

enum SupportPhysics {
    BUILTIN,
    CANNON,
    AMMO,
    BUILTIN_CANNON,
    BUILTIN_AMMO,
    CANNON_AMMO
}
Enum(SupportPhysics);

@ccclass("DeactiveCom")
@menu("physics/DeactiveCom")
export class DeactiveCom extends Component {

    @property({ type: SupportPhysics })
    support: SupportPhysics = SupportPhysics.AMMO;

    start () {
        // Your initialization goes here.
        switch (this.support) {
            case SupportPhysics.BUILTIN:
                if (CC_PHYSICS_BUILTIN)
                    return;

                this.node.active = false;
                break;
            case SupportPhysics.CANNON:
                if (CC_PHYSICS_CANNON)
                    return;

                this.node.active = false;
                break;
            case SupportPhysics.AMMO:
                if (CC_PHYSICS_AMMO)
                    return;

                this.node.active = false;
                break;
            case SupportPhysics.BUILTIN_CANNON:
                if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON)
                    return;

                this.node.active = false;
                break;
            case SupportPhysics.BUILTIN_AMMO:
                if (CC_PHYSICS_BUILTIN || CC_PHYSICS_AMMO)
                    return;

                this.node.active = false;
                break;
            case SupportPhysics.CANNON_AMMO:
                if (CC_PHYSICS_CANNON || CC_PHYSICS_AMMO)
                    return;

                this.node.active = false;
                break;
        }
    }
}
