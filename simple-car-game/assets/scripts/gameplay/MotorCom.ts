import { _decorator, Component, Node } from "cc";
import { MotorState } from "./MotorState";
import { MotorCtr } from "./MotorCtr";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property } = _decorator;

/**
 * 挂在 Node 上的组件，起到一个驱动器的作用，按顺序去执行其它行为的生命周期
 */

@ccclass("MotorCom")
export class MotorCom extends Component {

    @property({ type: MotorCtr })
    public MotorCtr: MotorCtr = new MotorCtr();

    public MotorState: MotorState = new MotorState();

    onLoad () {
        this.MotorState.onLoad();
        this.MotorCtr.onLoad();

        InstanceMgr.registerInstance('MotorCom', this);
    }

    start () {
        this.MotorState.start();
        this.MotorCtr.start();
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this.MotorState.update(deltaTime);
        this.MotorCtr.update(deltaTime);
    }
}
