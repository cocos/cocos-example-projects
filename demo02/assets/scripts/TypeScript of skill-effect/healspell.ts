import { _decorator, Component, Node, Prefab, instantiate } from "cc";
const { ccclass, property } = _decorator;

@ccclass("healspell")
export class healspell extends Component {


    @property([Prefab])
    effect: Prefab[] = [];
    @property([Node])
    Point: Node[] = []; 


    heal(){
        if(!this.enabled){
            return;
       }
        const point0 = instantiate(this.effect[0]) as Node;
        point0.setParent(this.node.parent);
        point0.setWorldPosition(1,2,4.5);
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
