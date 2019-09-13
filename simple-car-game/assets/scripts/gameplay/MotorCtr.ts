import { _decorator, Component, Node, Vec2, ConstantForce, Vec3, math } from "cc";
import { InstanceMgr } from "../InstanceMgr";
import { EFourDirType, EButtonState, EMotionState } from "../const/EnumDefine";
const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * @zh
 * MotorCtr 用来控制主角的动力
 * 由 MotorCom 来驱动
 */

@ccclass("MotorCtr")
@requireComponent(ConstantForce)
export class MotorCtr {

    /**
     * 力量的范围
     */
    @property({ type: Vec2 })
    public readonly range: Vec2 = new Vec2(-100, 100);

    /**
     * 每帧前进和后退的力量值
     */
    @property({ type: Vec2 })
    public readonly vertical: Vec2 = new Vec2(1, 1);

    /**
     * 每帧向左和向右的力量值
     */
    @property({ type: Vec2 })
    public readonly horizontal: Vec2 = new Vec2(1, 1);

    public constForce: ConstantForce = null;

    private _force: Vec3 = new Vec3();

    private get _z_positive () {
        return this.vertical.x;
    }

    private get _z_negative () {
        return -this.vertical.y;
    }

    private get _x_positive () {
        return this.horizontal.x;
    }

    private get _x_negative () {
        return -this.horizontal.y;
    }

    onLoad () {
        this._force.set(this.constForce.localForce);

        InstanceMgr.registerInstance('MotorCtr', this);
    }

    update (deltaTime: number) {
        if (InstanceMgr.MotorState.verticalState == EMotionState.POSITIVE) {
            this._force.z += this._z_positive * deltaTime;
        } else if (InstanceMgr.MotorState.verticalState == EMotionState.NEGATIVE) {
            this._force.z += this._z_negative * deltaTime;
        }

        if (InstanceMgr.MotorState.horizontalState == EMotionState.POSITIVE) {
            this._force.x += this._x_positive * deltaTime;
        } else if (InstanceMgr.MotorState.horizontalState == EMotionState.NEGATIVE) {
            this._force.x += this._x_negative * deltaTime;
        }

        this._force.z = math.clamp(this._force.z, this.range.x, this.range.y);
        this._force.x = math.clamp(this._force.x, this.range.x, this.range.y);
        this.constForce.localForce = this._force;
    }
}
