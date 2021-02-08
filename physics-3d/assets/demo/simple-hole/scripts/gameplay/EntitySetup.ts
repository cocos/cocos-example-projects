import { _decorator, Component, Node, ColliderComponent, SphereColliderComponent, ITriggerEvent, math, isValid, Vec3 } from "cc";
import { EGroup } from "./EGroupMask";
const { ccclass, property, menu } = _decorator;

const _ime = new math.Vec3();
const _pot = new math.Vec3();

@ccclass("SIMPLE-HOLE.EntitySetup")
@menu("demo/simple-hole/EntitySetup")
export class EntitySetup extends Component {

    @property({ type: Node })
    public roleNode: Node = null;

    @property({ type: Node })
    public planeNode: Node = null;

    start () {
        // role setup
        if (this.roleNode) {
            this.roleNode.name = 'Role';
            const colliders = this.roleNode.getComponents(ColliderComponent);

            const collider0 = colliders[0];
            if (collider0) {
                collider0.setGroup(EGroup.G_ROLE);
                collider0.setMask(EGroup.G_BODY);
                collider0.on('onTriggerEnter', this._onTriggerEnter0, this);
                collider0.on('onTriggerExit', this._onTriggerExit0, this);
            }

            const collider1 = colliders[1];
            if (collider1) {
                collider1.setGroup(EGroup.G_ROLE);
                collider1.setMask(EGroup.G_BODY);
                collider1.on('onTriggerStay', this._onTriggerStay1, this);
            }
        }

        // plane setup
        if (this.planeNode) {
            this.planeNode.name = 'Plane';
            let collider = this.getComponent(ColliderComponent);
            if (collider) {
                collider.setGroup(EGroup.G_PLANE);
                collider.setMask(EGroup.G_BODY);
            }
        }
    }

    private _onTriggerEnter0 (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Body') {
            event.otherCollider.setMask(EGroup.G_BODY + EGroup.G_ROLE);
            const that = event.otherCollider.node;
            setTimeout(() => {
                if (isValid(that)) {
                    if (that.active && that.worldPosition.y < 0) {
                        that.active = false;
                    }
                }
            }, 750);
        }
    }

    private _onTriggerExit0 (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Body') {
            if (event.otherCollider.node.worldPosition.y >= 0) {
                event.otherCollider.setMask(-1);
            }
        }
    }

    private _onTriggerStay1 (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Body') {
            if (event.otherCollider.attachedRigidBody) {
                const wp = event.otherCollider.node.worldPosition;
                _ime.x = wp.x - this.roleNode.worldPosition.x;
                _ime.z = wp.z - this.roleNode.worldPosition.z;
                Vec3.copy(_pot, _ime);
                _pot.normalize();
                _pot.y = 0.5;
                _ime.y = 0.5;
                _ime.negative();
                _ime.normalize();
                _ime.multiplyScalar(4);
                event.otherCollider.attachedRigidBody.applyImpulse(_ime, _pot);
            }
        }
    }
}
