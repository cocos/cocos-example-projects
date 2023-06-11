import { _decorator, Component, Node, HingeConstraint } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hinge_ctl')
export class hinge_ctl extends Component {

    @property({ type: Node })
    private hinge: Node = null as any;

    private _hingeJoint: HingeConstraint = null!;

    start() {
        this._hingeJoint = this.hinge.getComponent(HingeConstraint)!;
    }

    update(deltaTime: number) {
    }

    onDriveForceChange(slider: any) {
        if (this._hingeJoint) {
            this._hingeJoint.motorForceLimit = slider._progress * 1000;
        }
    }

    onDriveVelocityChange(slider: any) {
        if (this._hingeJoint) {
            this._hingeJoint.motorVelocity = slider._progress * 3600;
        }
    }
}


