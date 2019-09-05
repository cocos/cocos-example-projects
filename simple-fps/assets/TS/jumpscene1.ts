import { _decorator, Component, Node, Prefab, director, instantiate } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("jumpscene1")
export class jumpscene1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type:Prefab})
    public AppearParPrefab: Prefab =null;
    
    PrefabAppearPar(){
        var scene= director.getScene();
        var newAppearPar = instantiate(this.AppearParPrefab);
        scene.addChild(newAppearPar);
        newAppearPar.setPosition(this.node.getPosition());
    }

    start () {
        // Your initialization goes here.
    }

     update (deltaTime: number) {
         // Your update function goes here.
         //场景跳转自身位置变化
       if(Con.JumpSwitch1){
        this.node.setPosition(0,2,-38);
        this.PrefabAppearPar();
        Con.JumpSwitch1=false;
    }
    if(Con.JumpSwitch2){
        this.node.setPosition(0,2,-88);
        this.PrefabAppearPar();
        Con.JumpSwitch2=false;
    }
    if(Con.JumpSwitchBoss1){
        this.node.setPosition(0,2,62);
        this.PrefabAppearPar();
        Con.JumpSwitchBoss1=false;
    }
     }
}
