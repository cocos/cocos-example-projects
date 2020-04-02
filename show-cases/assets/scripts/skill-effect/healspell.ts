import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HealSpell')
export class HealSpell extends Component {

    @property([Prefab])
    public effect: Prefab[] = [];
    @property([Node])
    public Point: Node[] = [];

    public heal (){
        if (!this.enabled) {
            return;
       }
        const point0 = instantiate(this.effect[0]) as Node;
        point0.setParent(this.node);
        point0.setPosition(0, 0, 0);
        const point1 = instantiate(this.effect[1]) as Node;
        point1.setParent(this.Point[0]);
        point1.setWorldPosition(this.Point[0].getWorldPosition());
        const point2 = instantiate(this.effect[2]) as Node;
        point2.setParent(this.Point[1]);
        point2.setWorldPosition(this.Point[1].getWorldPosition());
        const point3 = instantiate(this.effect[1]) as Node;
        point3.setParent(this.Point[2]);
        point3.setWorldPosition(this.Point[2].getWorldPosition());
    }
}
