import { _decorator, Component, Node } from "cc";
import { MotorState } from "./MotorState";
import { MotorCtr } from "./MotorCtr";
import { InstanceMgr } from "../InstanceMgr";
const { ccclass, property } = _decorator;

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
