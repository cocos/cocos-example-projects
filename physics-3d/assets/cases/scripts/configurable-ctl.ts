import { _decorator, Component, Node, ConfigurableConstraint, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('configurable_ctl')
export class configurable_ctl extends Component {

    @property({ type: Node })
    private configurable: Node = null as any;

    private _configurableJoint: ConfigurableConstraint = null!;

    start() {
        this._configurableJoint = this.configurable.getComponent(ConfigurableConstraint)!;
    }

    update(deltaTime: number) {
        
    }

    onTwistExtentChange(slider: any) {
        if (this._configurableJoint) {
            this._configurableJoint.angularLimitSettings.twistExtent = math.clamp(slider._progress, 0.0001, 1) * 180;
        }
    }

    onSwing1ExtentChange(slider: any) {
        if (this._configurableJoint) {
            this._configurableJoint.angularLimitSettings.swingExtent1 = math.clamp(slider._progress, 0.0001, 1) * 180;
        }
    }

    onSwing2ExtentChange(slider: any) {
        if (this._configurableJoint) {
            this._configurableJoint.angularLimitSettings.swingExtent2 = math.clamp(slider._progress, 0.0001, 1) * 180;
        }
    }

    onTwistDriveForceChange(slider: any) {
        if (this._configurableJoint) {
            this._configurableJoint.angularDriverSettings.strength = slider._progress * 1000;
        }
    }

    onTwistDriveSpeedChange(slider: any) {
        if (this._configurableJoint) {
            const v = this._configurableJoint.angularDriverSettings.targetVelocity;
            v.x = slider._progress * 3600;
            this._configurableJoint.angularDriverSettings.targetVelocity = v;
        }
    }

    onXAxisLowerLimitChanged(slider: any) {
        if (this._configurableJoint) {
            const v = this._configurableJoint.linearLimitSettings.lower;
            v.x = (slider._progress * 2 - 1);
            this._configurableJoint.linearLimitSettings.lower = v;
        }
    }

    onXAxisUpperLimitChanged(slider: any) {
        if (this._configurableJoint) {
            const v = this._configurableJoint.linearLimitSettings.upper;
            v.x = (slider._progress * 2 - 1);
            this._configurableJoint.linearLimitSettings.upper = v;
        }
    }

    onXAxisDrivePositionChange(slider: any) {
        if (this._configurableJoint) {
            const v = this._configurableJoint.linearDriverSettings.targetPosition;
            v.x = slider._progress * 2 - 1;
            this._configurableJoint.linearDriverSettings.targetPosition = v;
        }
    }

    onXAxisDriveSpeedChange(slider: any) {
        if (this._configurableJoint) {
            const v = this._configurableJoint.linearDriverSettings.targetVelocity;
            v.x = (slider._progress * 2 - 1);
            this._configurableJoint.linearDriverSettings.targetVelocity = v;
        }
    }

    onLinearDriveForceChange(slider: any) {
        if (this._configurableJoint) {
            this._configurableJoint.linearDriverSettings.strength = slider._progress * 1000;
        }
    }
}