import { _decorator, Component, Node, Enum, PhysicsSystem } from "cc";
const { ccclass, property, menu } = _decorator;

enum SupportPhysics {
    BUILTIN,
    CANNON,
    AMMO,
    BUILTIN_CANNON,
    BUILTIN_AMMO,
    CANNON_AMMO,
    PHYSX,
    AMMO_PHYSX,
    BUILTIN_AMMO_PHYSX,
    CANNON_AMMO_PHYSX,
}
Enum(SupportPhysics);

@ccclass("CASES.SupportPhyiscs")
@menu("cases/SupportPhyiscs")
export class SupportPhyiscs extends Component {

    @property({ type: SupportPhysics })
    support: SupportPhysics = SupportPhysics.AMMO;

    start() {
        // Your initialization goes here.
        switch (this.support) {
            case SupportPhysics.BUILTIN:
                if (PhysicsSystem.PHYSICS_BUILTIN)
                    return;
                break;
            case SupportPhysics.CANNON:
                if (PhysicsSystem.PHYSICS_CANNON)
                    return;
                break;
            case SupportPhysics.AMMO:
                if (PhysicsSystem.PHYSICS_BULLET)
                    return;
                break;
            case SupportPhysics.BUILTIN_CANNON:
                if (PhysicsSystem.PHYSICS_BUILTIN || PhysicsSystem.PHYSICS_CANNON)
                    return;
                break;
            case SupportPhysics.BUILTIN_AMMO:
                if (PhysicsSystem.PHYSICS_BUILTIN || PhysicsSystem.PHYSICS_BULLET)
                    return;
                break;
            case SupportPhysics.CANNON_AMMO:
                if (PhysicsSystem.PHYSICS_CANNON || PhysicsSystem.PHYSICS_BULLET)
                    return;
                break;
            case SupportPhysics.AMMO_PHYSX:
                if (PhysicsSystem.PHYSICS_BULLET || PhysicsSystem.PHYSICS_PHYSX)
                    return;
                break;
            case SupportPhysics.BUILTIN_AMMO_PHYSX:
                if (PhysicsSystem.PHYSICS_BUILTIN || PhysicsSystem.PHYSICS_BULLET || PhysicsSystem.PHYSICS_PHYSX)
                    return;
                break;
            case SupportPhysics.CANNON_AMMO_PHYSX:
                if (PhysicsSystem.PHYSICS_CANNON || PhysicsSystem.PHYSICS_BULLET || PhysicsSystem.PHYSICS_PHYSX)
                    return;
                break;
        }

        this.node.active = false;
    }
}
