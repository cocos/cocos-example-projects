import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("deletecol1")
export class deletecol1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

     update (deltaTime: number) {
         // Your update function goes here.
         if(Con.DeleteSignal){
            //切换场景时删除已有组件
            const Parent = this.node.getParent();
            Parent.destroy();
            Con.DeleteSignal=false;
        }
     }
}
