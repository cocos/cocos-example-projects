import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("levelscol1")
export class levelscol1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        Con._LevelsCount=cc.math.randomRangeInt(4,6);
    }

     update (deltaTime: number) {
         // Your update function goes here.
         if(Con._AtLevel==Con._LevelsCount){
            //发出Boss出现信号
            Con.BossReSignal=true;
        }
     }

     recoil(){
        Con.RecoilSwitch=!Con.RecoilSwitch;
     }
}
