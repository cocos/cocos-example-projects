import { InstanceMgr } from "../InstanceMgr";
import { EFourDirType, EButtonState, EMotionState } from "../const/EnumDefine";

/**
 * 由 MotorCom 驱动
 */

export class MotorState {

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

    update (deltaTime: number) {
        let fdBtns = InstanceMgr.FourDirButtons;
        let isForwardDown = fdBtns.check(EFourDirType.FORWARD, EButtonState.START) || fdBtns.check(EFourDirType.FORWARD, EButtonState.MOVE);
        let isBackwardDown = fdBtns.check(EFourDirType.BACKWARD, EButtonState.START) || fdBtns.check(EFourDirType.BACKWARD, EButtonState.MOVE);
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

        let isTurnleftDown = fdBtns.check(EFourDirType.TURNLEFT, EButtonState.START) || fdBtns.check(EFourDirType.TURNLEFT, EButtonState.MOVE);
        let isTurnRightDown = fdBtns.check(EFourDirType.TURNRIGHT, EButtonState.START) || fdBtns.check(EFourDirType.TURNRIGHT, EButtonState.MOVE);
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
