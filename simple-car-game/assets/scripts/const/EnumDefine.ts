
export enum EFourDirType {
    FORWARD = 1 << 0,
    BACKWARD = 1 << 5,
    TURNLEFT = 1 << 10,
    TURNRIGHT = 1 << 15
}

export enum EButtonState {
    NONE = 0,
    START = 1,
    MOVE = 2,
    END = 3,
    CANCEL = 4
}

export enum EMotionState {
    NONE = 0,
    POSITIVE = 1,
    NEGATIVE = 2
}