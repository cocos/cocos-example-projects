import { _decorator, Component, Node, LabelComponent, SpriteComponent, Enum } from "cc";
const { ccclass, property, menu } = _decorator;

enum EPhysicsItem {
    BUILTIN = 1 << 0,
    CANNON = 1 << 1,
    AMMO = 1 << 2,
    CANNON_AMMO = EPhysicsItem.CANNON + EPhysicsItem.AMMO,
    ALL = -1,
}
Enum(EPhysicsItem);

@ccclass("PhysicsEnvCheck")
@menu("physics/PhysicsEnvCheck")
export class PhysicsEnvCheck extends Component {

    // @property({ type: EPhysicsItem })
    physics: EPhysicsItem = EPhysicsItem.CANNON_AMMO;

    onLoad () {
        if (CC_PHYSICS_BUILTIN) {
            const lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = "当前物理：builtin";
        } else if (CC_PHYSICS_CANNON) {
            const lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = "当前物理：cannon.js";
        } else if (CC_PHYSICS_AMMO) {
            const lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = "当前物理：ammo.js";
        } else {
            const lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = "当前物理：none";
        }

        const name = this.node.name;
        if (name == "cannon-ammo") {
            this.physics = EPhysicsItem.CANNON_AMMO;
        } else if (name == "builtin") {
            this.physics = EPhysicsItem.BUILTIN;
        } else if (name == "cannon") {
            this.physics = EPhysicsItem.CANNON;
        } else if (name == "ammo") {
            this.physics = EPhysicsItem.AMMO;
        } else if (name == "builtin-cannon-ammo") {
            this.physics = EPhysicsItem.ALL;
        }

        switch (this.physics) {
            case EPhysicsItem.ALL:
                break;
            case EPhysicsItem.CANNON_AMMO:
                if (CC_PHYSICS_CANNON || CC_PHYSICS_AMMO) {
                    break;
                }

                let lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                lbCom.enabled = true;
                lbCom.string = "测试此场景需要将物理模块设置为 cannon.js 或 ammo.js";
                let sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
                break;
            case EPhysicsItem.CANNON:
                if (!CC_PHYSICS_CANNON) {
                    let lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 cannon.js";
                    let sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.AMMO:
                if (!CC_PHYSICS_AMMO) {
                    let lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 ammo.js";
                    let sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.BUILTIN:
                if (!CC_PHYSICS_BUILTIN) {
                    let lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = "测试此场景需要将物理模块设置为 builtin";
                    let sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
        }
    }
}
