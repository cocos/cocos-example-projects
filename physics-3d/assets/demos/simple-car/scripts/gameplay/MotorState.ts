import { InstanceMgr } from "./InstanceMgr";
import { EFourDirType, EButtonState, EMotionState } from "../const/EnumDefine";

/**
 * MotorState 用来标记运动状态的行为
 * 由 MotorCom 驱动
 */

export class MotorState implements IMotorBehaviour {

    public get verticalState () {
        return this._verticalState;
    }

    private _verticalState: EMotionState = EMotionState.NONE;


    public get horizontalState () {
        return this._horizontalState;
    }

    private _horizontalState: EMotionState = EMotionState.NONE;

    onLoad () {
        InstanceMgr.registerInstance('MotorState', this);
    }

    start () {

    }

    update (deltaTime: number) {
        let fdBtns = InstanceMgr.FourDirButtons;
        let isForwardDown = fdBtns.check(EFourDirType.FORWARD, EButtonState.TOUCH_START) || fdBtns.check(EFourDirType.FORWARD, EButtonState.TOUCH_MOVE);
        let isBackwardDown = fdBtns.check(EFourDirType.BACKWARD, EButtonState.TOUCH_START) || fdBtns.check(EFourDirType.BACKWARD, EButtonState.TOUCH_MOVE);
        if (isForwardDown) {
            if (isBackwardDown) {
                this._verticalState = EMotionState.NONE;
            } else {
                this._verticalState = EMotionState.POSITIVE;
            }
        } else {
            if (isBackwardDown) {
                this._verticalState = EMotionState.NEGATIVE;
            } else {
                this._verticalState = EMotionState.NONE;
            }
        }

        let isTurnleftDown = fdBtns.check(EFourDirType.TURNLEFT, EButtonState.TOUCH_START) || fdBtns.check(EFourDirType.TURNLEFT, EButtonState.TOUCH_MOVE);
        let isTurnRightDown = fdBtns.check(EFourDirType.TURNRIGHT, EButtonState.TOUCH_START) || fdBtns.check(EFourDirType.TURNRIGHT, EButtonState.TOUCH_MOVE);
        if (isTurnleftDown) {
            if (isTurnRightDown) {
                this._horizontalState = EMotionState.NONE;
            } else {
                this._horizontalState = EMotionState.POSITIVE;
            }
        } else {
            if (isTurnRightDown) {
                this._horizontalState = EMotionState.NEGATIVE;
            } else {
                this._horizontalState = EMotionState.NONE;
            }
        }
    }
}
