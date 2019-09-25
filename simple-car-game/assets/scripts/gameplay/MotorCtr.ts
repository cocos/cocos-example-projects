import { _decorator, Vec2, Vec3, math, RigidBodyComponent, Quat } from "cc";
import { InstanceMgr } from "../InstanceMgr";
import { EMotionState } from "../const/EnumDefine";
const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * @zh
 * MotorCtr 用来控制主角动力
 * 由 MotorCom 来驱动
 */

@ccclass("MotorCtr")
@menu("motor/MotorCtr")
@requireComponent(RigidBodyComponent)
export class MotorCtr {

    @property({ type: Vec2 })
    public readonly vertical: Vec2 = new Vec2();

    @property({ type: Vec2 })
    public readonly torque: Vec2 = new Vec2();

    public rigidBody: RigidBodyComponent;

    private _force: Vec3 = new Vec3();
    private _torque: Vec3 = new Vec3();
    private _linearVelocity: Vec3 = new Vec3();

    onLoad () {
        InstanceMgr.registerInstance('MotorCtr', this);
    }

    start () {
        this.rigidBody = InstanceMgr.MotorCom.getComponent(RigidBodyComponent);
    }

    update (deltaTime: number) {
        // is in air ?
        // if (this.rigidBody.node.worldPosition.y > 0.1) {
        //     return;
        // }

        // this._torque.set(0, 0, 0);
        // if (InstanceMgr.MotorState.horizontalState == EMotionState.POSITIVE) {
        //     this._torque.y = this.torque.x;
        // } else if (InstanceMgr.MotorState.horizontalState == EMotionState.NEGATIVE) {
        //     this._torque.y = -this.torque.y;
        // }

        // if (!this._torque.strictEquals(Vec3.ZERO)) {
        //     this.rigidBody.setAngularVelocity(this._torque);
        // }

        // rotation

        if (InstanceMgr.MotorState.horizontalState == EMotionState.POSITIVE) {
            this.rigidBody.node.rotate(Quat.fromEuler(new Quat(), 0, this.torque.x * deltaTime, 0), 1);
        } else if (InstanceMgr.MotorState.horizontalState == EMotionState.NEGATIVE) {
            this.rigidBody.node.rotate(Quat.fromEuler(new Quat(), 0, -this.torque.x * deltaTime, 0), 1);
        }

        // add world velocity

        this._force.set(0, 0, 0);
        if (InstanceMgr.MotorState.verticalState == EMotionState.POSITIVE) {
            this._force.z = this.vertical.x;
        } else if (InstanceMgr.MotorState.verticalState == EMotionState.NEGATIVE) {
            this._force.z = -this.vertical.y;
        }

        if (!this._force.strictEquals(Vec3.ZERO)) {
            Vec3.transformQuat(this._force, this._force, this.rigidBody.node.worldRotation);
            this.rigidBody.getLinearVelocity(this._linearVelocity);
            this._linearVelocity.x = this._force.x;
            this._linearVelocity.z = this._force.z;
            this.rigidBody.setLinearVelocity(this._linearVelocity);
        }

    }
}
