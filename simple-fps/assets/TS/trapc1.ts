import { _decorator, Component, Node, ColliderComponent } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("typec1")
export class typec1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

        private collider:any=null;

    start () {
        // Your initialization goes here.
        //触发事件
        this.collider = this.node.getComponent(ColliderComponent);
		this.collider.on('onTriggerEnter',this.onTrigger,this);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'){
            Con.PlayerHp-=20;   //数字方便测试 不合理！！！！！！！
            Con.PlayerHit=true;
        }
    }
}
