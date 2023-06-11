import { _decorator, Component, Node, LabelComponent, SpriteComponent, Enum, physics } from "cc";
const { ccclass, property, menu } = _decorator;

enum EPhysicsItem {
    BUILTIN = 1 << 0,
    CANNON = 1 << 1,
    BULLET = 1 << 2,
    BUILTIN_BULLET = EPhysicsItem.BUILTIN + EPhysicsItem.BULLET,
    CANNON_BULLET = EPhysicsItem.CANNON + EPhysicsItem.BULLET,
    ALL = -1,
}
Enum(EPhysicsItem);

@ccclass("CHECKS.PhysicsEnvCheck")
@menu("misc/checks/PhysicsEnvCheck")
export class PhysicsEnvCheck extends Component {

    // @property({ type: EPhysicsItem })
    physics: EPhysicsItem = EPhysicsItem.CANNON_BULLET;

    onLoad() {
        const title = this.node.getChildByName('desc')!.getComponent(LabelComponent)!;
        title.fontSize = 30;
        if (physics.PhysicsSystem.PHYSICS_BULLET) {
            title.string = "bullet";
        } else {
            title.string = physics.selector.id;
        }

        if (physics.PhysicsSystem.PHYSICS_PHYSX) return;

        const name = this.node.name;
        if (name == "cannon-bullet") {
            this.physics = EPhysicsItem.CANNON_BULLET;
        } else if (name == "builtin") {
            this.physics = EPhysicsItem.BUILTIN;
        } else if (name == "cannon") {
            this.physics = EPhysicsItem.CANNON;
        } else if (name == "bullet") {
            this.physics = EPhysicsItem.BULLET;
        } else if (name == "builtin-cannon-bullet") {
            this.physics = EPhysicsItem.ALL;
        } else if (name == "builtin-bullet") {
            this.physics = EPhysicsItem.BUILTIN_BULLET;
        }

        switch (this.physics) {
            case EPhysicsItem.ALL:
                break;
            case EPhysicsItem.CANNON_BULLET:
                if (physics.PhysicsSystem.PHYSICS_CANNON || physics.PhysicsSystem.PHYSICS_BULLET) {
                    break;
                }

                let lbCom = this.node.getChildByName('lb')!.getComponent(LabelComponent)!;
                lbCom.enabled = true;
                lbCom.string = "测试此场景需要将物理模块设置为 cannon.js, physx 或 bullet";
                let sprCom = this.getComponentInChildren(SpriteComponent)!;
                sprCom.enabled = true;
                break;

            case EPhysicsItem.BUILTIN_BULLET:
                if (physics.PhysicsSystem.PHYSICS_BUILTIN || physics.PhysicsSystem.PHYSICS_BULLET) {
                    break;
                }

                let lbCom1 = this.node.getChildByName('lb')!.getComponent(LabelComponent)!;
                lbCom1.enabled = true;
                lbCom1.string = "测试此场景需要将物理模块设置为 builtin, physx 或 bullet";
                let sprCom1 = this.getComponentInChildren(SpriteComponent)!;
                sprCom1.enabled = true;
                break;

            case EPhysicsItem.CANNON:
                if (!physics.PhysicsSystem.PHYSICS_CANNON) {
                    let lbCom = this.node.getChildByName('lb')!.getComponent(LabelComponent)!;
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 cannon.js 或 physx";
                    let sprCom = this.getComponentInChildren(SpriteComponent)!;
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.BULLET:
                if (!physics.PhysicsSystem.PHYSICS_BULLET) {
                    let lbCom = this.node.getChildByName('lb')!.getComponent(LabelComponent)!;
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 bullet 或 physx";
                    let sprCom = this.getComponentInChildren(SpriteComponent)!;
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.BUILTIN:
                if (!physics.PhysicsSystem.PHYSICS_BUILTIN) {
                    let lbCom = this.node.getChildByName('lb')!.getComponent(LabelComponent)!;
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 builtin 或 physx";
                    let sprCom = this.getComponentInChildren(SpriteComponent)!;
                    sprCom.enabled = true;
                }
                break;
        }
    }
}
