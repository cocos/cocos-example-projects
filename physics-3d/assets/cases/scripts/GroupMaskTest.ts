import { _decorator, Component, Node, Enum, ColliderComponent, EventTouch, RigidBodyComponent, PhysicsSystem } from 'cc';
const { ccclass, property, menu } = _decorator;

export enum EPHY_MASK {
    M_NONE = 0,
    M_ALL = 0xffffffff
};

Enum(EPHY_MASK);

@ccclass('CASES.GroupMaskTestItem')
class GroupMaskTestItem {
    @property({ type: Node })
    target: Node = null as any;

    @property({ type: PhysicsSystem.PhysicsGroup })
    group = PhysicsSystem.PhysicsGroup.DEFAULT;

    @property({ type: EPHY_MASK })
    mask = EPHY_MASK.M_ALL;
}

@ccclass('CASES.GroupMaskTest')
@menu("cases/GroupMaskTest")
export class GroupMaskTest extends Component {

    @property({ type: [GroupMaskTestItem] })
    items: GroupMaskTestItem[] = []

    @property({ type: RigidBodyComponent })
    testBody: RigidBodyComponent = null as any;

    start () {
        this.items.forEach((i: GroupMaskTestItem) => {
            if (i.target) {
                let c = i.target.getComponent(ColliderComponent)!;
                c.setGroup(i.group);
                c.setMask(i.mask);
            }
        });

        this.testBody.setMask(0);
    }

    setItemMaskToNone (event: EventTouch, index: string) {
        const int = parseInt(index);
        let c = this.items[int].target.getComponent(ColliderComponent)!;
        c.setMask(EPHY_MASK.M_NONE);

        this.items.forEach((i: GroupMaskTestItem) => {
            if (i.target) {
                let c = i.target.getComponent(RigidBodyComponent);
                if (c) c.wakeUp();
            }
        });
    }

}
