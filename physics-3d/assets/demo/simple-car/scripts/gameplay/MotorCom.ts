import { _decorator, Component, Node, director, js, PhysicsSystem, Vec3 } from "cc";
import { MotorState } from "./MotorState";
import { MotorCtr } from "./MotorCtr";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-CAR.MotorCom")
@menu("demo/simple-car/MotorCom")
export class MotorCom extends Component {

    // @property({ type: js.getClassByName("SIMPLE-CAR.MotorCtr") })
    @property({ type: MotorCtr })
    public MotorCtr: MotorCtr = new MotorCtr();

    public MotorState: MotorState = new MotorState();

    __preload () {
        PhysicsSystem.instance.gravity = new Vec3(0, -30, 0);
    }

    onLoad () {
        this.MotorState.onLoad();
        this.MotorCtr.onLoad();

        InstanceMgr.registerInstance('MotorCom', this);
    }

    start () {
        this.MotorState.start();
        this.MotorCtr.start();

        this.enabled = false;
        this.MotorCtr.rigidBody.useGravity = false;
        director.once('onMapLoaded' as any, this.onMapLoaded, this);
    }

    update (deltaTime: number) {
        this.MotorState.update(deltaTime);
        this.MotorCtr.update(deltaTime);
    }

    onMapLoaded () {
        this.enabled = true;
        this.MotorCtr.rigidBody.useGravity = true;
    }

    onDestroy () {
        director.off('onMapLoaded' as any, this.onMapLoaded, this);
        InstanceMgr.reset();
        PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
    }
}
