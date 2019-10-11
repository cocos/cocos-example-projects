import { _decorator, Component, Node, PhysicMaterial, ColliderComponent, Vec3 } from "cc";
const { ccclass, property } = _decorator;

/**
 * 简单的物理材质修改，辅助修改 Collider 的物理材质属性
 */

@ccclass("PhysicMaterialSetup")
export class PhysicMaterialSetup extends Component {

    @property({ type: ColliderComponent })
    public collider: ColliderComponent = null;

    @property
    public friction: number = 0;

    @property
    public restitution: number = 0;

    start () {
        if (this.collider) {
            this.collider.material.friction = this.friction;
            this.collider.material.restitution = this.restitution;
        }
    }

}