import { _decorator, Component, Node, director, Enum, LabelComponent } from "cc";
const { ccclass, property } = _decorator;

enum EPhyiscsEnvType {
    NON_PHYSICS,
    BUILTIN,
    CANNON,
    AMMO
}
Enum(EPhyiscsEnvType);

@ccclass("PhysicsEnvCheck")
export class PhysicsEnvCheck extends Component {

    @property
    sceneName = 'main';

    @property({ type: EPhyiscsEnvType })
    checkType = EPhyiscsEnvType.NON_PHYSICS;

    @property({ type: Node })
    envSprite: Node = null;

    @property({ type: LabelComponent })
    descLabel: LabelComponent = null;

    start () {
        let v = true;
        let s = 'non physics';
        switch (this.checkType) {
            case EPhyiscsEnvType.BUILTIN:
                v = CC_PHYSICS_BUILTIN;
                s = 'builtin';
                break;

            case EPhyiscsEnvType.CANNON:
                v = CC_PHYSICS_CANNON;
                s = 'cannon';
                break;

            case EPhyiscsEnvType.AMMO:
                v = CC_PHYSICS_AMMO;
                s = 'ammmo';
                break;
        }

        if (v) {
            this.envSprite.active = false;
            director.loadScene(this.sceneName, null, null);
        } else {
            this.descLabel.string = "运行此项目需要将物理模块设置为：" + s;
            this.envSprite.active = true;
        }
    }

}
