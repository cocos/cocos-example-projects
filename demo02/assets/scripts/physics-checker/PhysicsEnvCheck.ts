import { _decorator, Component, Enum, LabelComponent, Node, SpriteComponent } from 'cc';
const { ccclass, property, menu } = _decorator;

enum EPhysicsItem {
    BUILTIN = 1 << 0,
    CANNON = 1 << 1,
    AMMO = 1 << 2,
    CANNON_AMMO = EPhysicsItem.CANNON + EPhysicsItem.AMMO,
    ALL = -1,
}
Enum(EPhysicsItem);

@ccclass('PhysicsEnvCheck')
@menu('physics/PhysicsEnvCheck')
export class PhysicsEnvCheck extends Component {

    // @property({ type: EPhysicsItem })
    public physics: EPhysicsItem = EPhysicsItem.CANNON_AMMO;

    public onLoad () {
        let lbCom: LabelComponent;
        let sprCom: SpriteComponent;

        if (window.CC_PHYSICS_BUILTIN) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：builtin';
        } else if (window.CC_PHYSICS_CANNON) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：cannon.js';
        } else if (window.CC_PHYSICS_AMMO) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：ammo.js';
        } else {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：none';
        }

        const name = this.node.name;
        if (name === 'cannon-ammo') {
            this.physics = EPhysicsItem.CANNON_AMMO;
        } else if (name === 'builtin') {
            this.physics = EPhysicsItem.BUILTIN;
        } else if (name === 'cannon') {
            this.physics = EPhysicsItem.CANNON;
        } else if (name === 'ammo') {
            this.physics = EPhysicsItem.AMMO;
        } else if (name === 'builtin-cannon-ammo') {
            this.physics = EPhysicsItem.ALL;
        }

        switch (this.physics) {
            case EPhysicsItem.ALL:
                break;
            case EPhysicsItem.CANNON_AMMO:
                if (window.CC_PHYSICS_CANNON || window.CC_PHYSICS_AMMO) {
                    break;
                }
                lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                lbCom.enabled = true;
                lbCom.string = '测试此场景需要将物理模块设置为 cannon.js 或 ammo.js';
                sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
                break;
            case EPhysicsItem.CANNON:
                if (!window.CC_PHYSICS_CANNON) {
                    lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = '测试此场景需要将物理模块设置为 cannon.js';
                    sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.AMMO:
                if (!window.CC_PHYSICS_AMMO) {
                    lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = '测试此场景需要将物理模块设置为 ammo.js';
                    sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
            case EPhysicsItem.BUILTIN:
                if (!window.CC_PHYSICS_BUILTIN) {
                    lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                    lbCom.enabled = true;
                    lbCom.string = '测试此场景需要将物理模块设置为 builtin';
                    sprCom = this.getComponentInChildren(SpriteComponent);
                    sprCom.enabled = true;
                }
                break;
        }
    }
}
