import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("selfdestory")
export class selfdestory extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        setTimeout(() => {
            if(this.node && this.node.destroy()==true){
            console.log('destroy complete');
           }
        }, 5000);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
