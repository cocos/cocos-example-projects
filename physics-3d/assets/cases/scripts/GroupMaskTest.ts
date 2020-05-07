import { _decorator, Component, Node, Enum, ColliderComponent, EventTouch } from 'cc';
const { ccclass, property, menu } = _decorator;

export enum EPHY_GROUP {
    G_0 = 1 << 0,
    G_1 = 1 << 1,
    G_2 = 1 << 2,
};

Enum(EPHY_GROUP);

export enum EPHY_MASK {
    M_NONE = 0,
    M_0 = EPHY_GROUP.G_0,
    M_1 = EPHY_GROUP.G_1,
    M_2 = EPHY_GROUP.G_2,
    M_012 = EPHY_GROUP.G_0 + EPHY_GROUP.G_1 + EPHY_GROUP.G_2,
    M_3 = EPHY_GROUP.G_2 << 1,
};

Enum(EPHY_MASK);

@ccclass('CASES.GroupMaskTestItem')
class GroupMaskTestItem {
    @property({ type: Node })
    target: Node = null;

    @property({ type: EPHY_GROUP })
    group = EPHY_GROUP.G_0;

    @property({ type: EPHY_MASK })
    mask = EPHY_MASK.M_012;
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
                c.setGroup(i.group);
                c.setMask(i.mask);
            }
        });
    }

    setItemMaskToNone (event: EventTouch, index: string) {
        const int = parseInt(index);
        let c = this.items[int].target.getComponent(ColliderComponent);
        c.setMask(EPHY_MASK.M_NONE);
    }

}
