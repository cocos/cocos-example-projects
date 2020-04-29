import { _decorator, Vec2, Vec3, math, RigidBodyComponent, Quat, clamp } from "cc";
import { InstanceMgr } from "./InstanceMgr";
import { EMotionState } from "../const/EnumDefine";
const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * MotorCtr 用来控制主角运动的行为
 * 由 MotorCom 来驱动
 */

@ccclass("MotorCtr")
@menu("motor/MotorCtr")
@requireComponent(RigidBodyComponent)
export class MotorCtr implements IMotorBehaviour {

    @property({ type: Vec2 })
    public readonly vertical: Vec2 = new Vec2();

    @property({ type: Vec2 })
    public readonly torque: Vec2 = new Vec2();

    public rigidBody: RigidBodyComponent;

    private _forceZ: number = 0;
    private _force: Vec3 = new Vec3();
    private _linearVelocity: Vec3 = new Vec3();

    onLoad () {
        InstanceMgr.registerInstance('MotorCtr', this);
    }

    start () {
        this.rigidBody = InstanceMgr.MotorCom.getComponent(RigidBodyComponent);
    }

    update (deltaTime: number) {

        // add world velocity

        if (InstanceMgr.MotorState.verticalState == EMotionState.POSITIVE) {
            this._forceZ += this.vertical.x * deltaTime;
        } else if (InstanceMgr.MotorState.verticalState == EMotionState.NEGATIVE) {
            this._forceZ += -this.vertical.x * deltaTime;
        } else {
            this._forceZ = 0;
        }

        // translate by velocity

        if (this._forceZ != 0) {
            this._forceZ = clamp(this._forceZ, -this.vertical.y, this.vertical.y);
            this._force.set(0, 0, this._forceZ);
            Vec3.transformQuat(this._force, this._force, this.rigidBody.node.worldRotation);
            this.rigidBody.getLinearVelocity(this._linearVelocity);
            this._linearVelocity.x = this._force.x;
            this._linearVelocity.z = this._force.z;
            this.rigidBody.setLinearVelocity(this._linearVelocity);
        }

        // rotation by transform

        if (this._forceZ != 0) {
            const factor = Math.abs(1.5 * this._forceZ / this.vertical.y);
            if (InstanceMgr.MotorState.horizontalState == EMotionState.POSITIVE) {
                this.rigidBody.node.rotate(Quat.fromEuler(new Quat(), 0, this.torque.x * deltaTime * factor, 0), 1);
            } else if (InstanceMgr.MotorState.horizontalState == EMotionState.NEGATIVE) {
                this.rigidBody.node.rotate(Quat.fromEuler(new Quat(), 0, -this.torque.x * deltaTime * factor, 0), 1);
            }
        }

        // reset angular velocity

        this.rigidBody.getAngularVelocity(this._force);
        this._force.y = 0;
        this.rigidBody.setAngularVelocity(this._force);
    }
}
