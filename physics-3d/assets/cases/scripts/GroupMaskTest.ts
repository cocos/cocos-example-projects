import { _decorator, Component, Node, Enum, ColliderComponent, EventTouch, RigidBodyComponent, PhysicsSystem, Layers } from 'cc';
const { ccclass, property, menu } = _decorator;

export enum EPHY_GROUP {
    DEFAULT = Layers.Enum.DEFAULT,
};

Enum(EPHY_GROUP);

export enum EPHY_MASK {
    M_NONE = 0,
    M_ALL = 0xffffffff
};

Enum(EPHY_MASK);

@ccclass('CASES.GroupMaskTestItem')
class GroupMaskTestItem {
    @property({ type: Node })
    target: Node = null;

    @property({ type: EPHY_GROUP })
    group = EPHY_GROUP.DEFAULT;

    @property({ type: EPHY_MASK })
    mask = EPHY_MASK.M_ALL;
}

@ccclass('CASES.GroupMaskTest')
@menu("cases/GroupMaskTest")
export class GroupMaskTest extends Component {

    @property({ type: [GroupMaskTestItem] })
    items: GroupMaskTestItem[] = []

    start () {
        this.items.forEach((i: GroupMaskTestItem) => {
            if (i.target) {
                let c = i.target.getComponent(ColliderComponent);
                if (PhysicsSystem.instance.useCollisionMatrix) {
                    c.setGroup(i.group);
                    PhysicsSystem.instance[i.group] = i.mask;
                } else {
                    c.setGroup(i.group);
                    c.setMask(i.mask);
                }
            }
        });
    }

    setItemMaskToNone (event: EventTouch, index: string) {
        const int = parseInt(index);
        let c = this.items[int].target.getComponent(ColliderComponent);
        if (PhysicsSystem.instance.useCollisionMatrix) {
            PhysicsSystem.instance.collisionMatrix[c.getGroup()] = EPHY_MASK.M_NONE;
        } else {
            c.setMask(EPHY_MASK.M_NONE);
        }

        this.items.forEach((i: GroupMaskTestItem) => {
            if (i.target) {
                let c = i.target.getComponent(RigidBodyComponent);
                if (c) c.wakeUp();
            }
        });
    }

    onDestroy () {
        if (PhysicsSystem.instance.useCollisionMatrix)
            PhysicsSystem.instance['resetCollisionMatrix']();
    }

}
