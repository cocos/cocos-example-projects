import { _decorator, Component, Node, ColliderComponent, SphereColliderComponent, ITriggerEvent, math } from "cc";
import { EGroup } from "./EGroupMask";
const { ccclass, property } = _decorator;

const _dir = new math.Vec3;
_dir.y = 1;
const _impluse = new math.Vec3(2, 6, 2);

@ccclass("EntitySetup")
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
                if (collider0 instanceof SphereColliderComponent) {
                    collider0.radius = 2;
                }
                collider0.isTrigger = true;
                collider0.setGroup(EGroup.G_ROLE);
                collider0.setMask(EGroup.G_BODY);
                collider0.on('onTriggerEnter', this._onTriggerEnter0, this);
                collider0.on('onTriggerExit', this._onTriggerExit0, this);
            }

            const collider1 = colliders[1];
            if (collider1) {
                if (collider1 instanceof SphereColliderComponent) {
                    collider1.radius = 3.2;
                }
                collider1.isTrigger = true;
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
                if (that.active && that.worldPosition.y < 0) {
                    that.active = false;
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
            if (event.otherCollider.attachedRigidbody) {
                _dir.x = event.otherCollider.node.worldPosition.x - this.roleNode.worldPosition.x;
                _dir.z = event.otherCollider.node.worldPosition.z - this.roleNode.worldPosition.z;
                // _dir.normalize();
                event.otherCollider.attachedRigidbody.applyImpulse(_impluse, _dir);
            }
        }
    }
}
