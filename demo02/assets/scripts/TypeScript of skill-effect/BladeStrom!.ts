import { _decorator, Component, Node, ModelComponent, Prefab, instantiate, Enum, Socket } from "cc";
const { ccclass, property } = _decorator;
enum SkilType {
    SELF,
    ENEMY,
}

class fight {
    @property 
    type: SkilType = SkilType.SELF;
    @property(Prefab)
    effect: Prefab = null;

    explo(){
        const effect = instantiate(this.effect) as Node;
        effect.setWorldPosition(0,0,0);
    }
}
@ccclass("BladeStrom")
export class BladeStrom extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    //@property(ModelComponent)
    //model: ModelComponent = null;
    @property([Prefab])
    effect: Prefab[] = [];
    //@property([Socket])
    //Point: Socket[] = [];
    @property([Node])
    Point: Node[] = []; 
    //@property(Prefab)
    //new_one: Prefab = null;
    //@property(fight)
    //fight1: fight=null;
    /*get bbb(){
        return this._aaa;
    }

    set bbb (value){
        this._aaa = value;

    }

    _aaa = '';*/

    fire(){
        //console.log('comming');
        if(!this.enabled){
             return;
        }
        const new_one = instantiate(this.effect[0]) as Node;
        new_one.setParent(this.node.parent as Node);
        new_one.setWorldPosition(1,7,20);
        //const self_blade = instantiate(this.effect[6]) as Node;
        //self_blade.setParent(this.node.parent);
        //self_blade.setWorldPosition(1,2,3);
        const point1 = instantiate(this.effect[2]) as Node;
        point1.setParent(this.Point[0]);
        point1.setWorldPosition(this.Point[0].getWorldPosition());
        const point2 = instantiate(this.effect[1]) as Node;
        point2.setParent(this.Point[1]);
        point2.setWorldPosition(this.Point[1].getWorldPosition());
        const point3 = instantiate(this.effect[2]) as Node;
        point3.setParent(this.Point[2]);
        point3.setWorldPosition(this.Point[2].getWorldPosition());
        //const CFD = instantiate(this.effect[3]) as Node;
        //CFD.setParent(this.node.parent);
        //CFD.setWorldPosition(CFD.getPosition(this.Point[0]));
    }

    ring(){
        if(!this.enabled){
            return;
       }
        const point4 = instantiate(this.effect[3]) as Node;
        point4.setParent(this.node.parent as Node);
        point4.setWorldPosition(1,2,4.5);
        const point5 = instantiate(this.effect[4]) as Node;
        point5.setParent(this.node.parent as Node);
        point5.setWorldPosition(1,2,4.5);

        /*setTimeout(() => {
            this.node
        }, 1000);  */
    }

    /*heal(){
        //console.log('comming');
        const new_one = instantiate(this.effect[2]) as Node;
        new_one.setParent(this.node.parent);
        new_one.setWorldPosition(1,2,3);
    }*/

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
