import { FourDirButtons } from "./ui/FourDirButtons";
import { MotorCtr } from "./gameplay/MotorCtr";
import { MotorCom } from "./gameplay/MotorCom";
import { MotorState } from "./gameplay/MotorState";
import { DebugManager } from "./debug/DebugManager";

export class InstanceMgr {

    static readonly FourDirButtons: FourDirButtons;

    static readonly MotorCom: MotorCom;

    static readonly MotorState: MotorState;

    static readonly MotorCtr: MotorCtr;

    static readonly DebugManager: DebugManager;

    static registerInstance (name: string, entity: any) {
        if (InstanceMgr[name] != null) {
            console.error(name, 'is duplicate');
        } else {
            InstanceMgr[name] = entity;
        }
    }
}
