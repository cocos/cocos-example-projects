import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("NewScript")
export class NewScript extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property({type:Prefab})
    public Portal1Prefab: Prefab =null;

    //实例化传送门
    PrefabPortal1(){
        var scene= cc.director.getScene();
        var newPortal1 = cc.instantiate(this.Portal1Prefab);
        scene.addChild(newPortal1);
        newPortal1.setPosition(this.node.getParent().getPosition().x+10,1,this.node.getParent().getPosition().z-12);
    }

    start () {
        // Your initialization goes here.
    }

     update (deltaTime: number) {
         // Your update function goes here.
         //检测场景里没有怪物了实例化传送门
        if(cc.director.getScene().getChildByName('Monster')==null&&Con.AlreadyReMonster){
            this.PrefabPortal1();
            Con.AlredyReProps=true;
            if(Con.AlredyReProps){
            Con.AlreadyReMonster=false;
            }
        }
     }
}
