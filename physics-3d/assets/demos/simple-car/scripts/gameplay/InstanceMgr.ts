import { FourDirButtons } from "../gameplay/FourDirButtons";
import { MotorCtr } from "../gameplay/MotorCtr";
import { MotorCom } from "../gameplay/MotorCom";
import { MotorState } from "../gameplay/MotorState";
import { DebugManager } from "../debug/DebugManager";
import { BonusMgr } from "./BonusMgr";

/**
 * Hack 的做法，避免循环引用，并可以方便的在各个文件访问具体的实例和减少模块间的导入耦合
 */

export class InstanceMgr {

    static readonly FourDirButtons: FourDirButtons;

    static readonly MotorCom: MotorCom;

    static readonly MotorState: MotorState;

    static readonly MotorCtr: MotorCtr;

    static readonly DebugManager: DebugManager;

    static readonly BonusMgr: BonusMgr;

    static registerInstance (name: string, entity: any) {
        if (InstanceMgr[name] != null) {
            console.error(name, 'is duplicate');
        } else {
            InstanceMgr[name] = entity;
        }
    }
}
