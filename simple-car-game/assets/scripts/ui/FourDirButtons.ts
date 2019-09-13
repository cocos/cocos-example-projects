import { _decorator, Component, Node, ButtonComponent, SystemEventType, EventTouch } from "cc";
import { EFourDirType, EButtonState } from "../const/EnumDefine";
import { InstanceMgr } from "../InstanceMgr";
const { ccclass, property } = _decorator;

@ccclass("FourDirButtons")
export class FourDirButtons extends Component {

    public forwardNode: Node = null;

    public backwardNode: Node = null;

    public turnleftNode: Node = null;

    public turnRightNode: Node = null;

    private _forward: number = 0;

    private _backward: number = 0;

    private _turnleft: number = 0;

    private _turnright: number = 0;

    public check (dirType: EFourDirType, buttonState: EButtonState) {
        let _t: number = this._forward;
        if (dirType == EFourDirType.BACKWARD) {
            _t = this._backward;
        } else if (dirType == EFourDirType.TURNLEFT) {
            _t = this._turnleft;
        } else if (dirType == EFourDirType.TURNRIGHT) {
            _t = this._turnright;
        }
        return _t & (dirType << buttonState);
    }

    onLoad () {
        this.forwardNode = this.node.getChildByName('Forward') as Node;;
        this.backwardNode = this.node.getChildByName('Backward') as Node;
        this.turnleftNode = this.node.getChildByName('Turnleft') as Node;
        this.turnRightNode = this.node.getChildByName('Turnright') as Node;

        InstanceMgr.registerInstance('FourDirButtons', this);
    }

    onEnable () {
        this.addEvents();
    }

    onDisable () {
        this.removeEvents();
    }

    addEvents () {
        this.forwardNode.on(SystemEventType.TOUCH_START, this._onForward, this);
        this.forwardNode.on(SystemEventType.TOUCH_CANCEL, this._onForward, this);
        this.forwardNode.on(SystemEventType.TOUCH_MOVE, this._onForward, this);
        this.forwardNode.on(SystemEventType.TOUCH_END, this._onForward, this);

        this.backwardNode.on(SystemEventType.TOUCH_START, this._onBackward, this);
        this.backwardNode.on(SystemEventType.TOUCH_CANCEL, this._onBackward, this);
        this.backwardNode.on(SystemEventType.TOUCH_MOVE, this._onBackward, this);
        this.backwardNode.on(SystemEventType.TOUCH_END, this._onBackward, this);

        this.turnleftNode.on(SystemEventType.TOUCH_START, this._onTurnleft, this);
        this.turnleftNode.on(SystemEventType.TOUCH_CANCEL, this._onTurnleft, this);
        this.turnleftNode.on(SystemEventType.TOUCH_MOVE, this._onTurnleft, this);
        this.turnleftNode.on(SystemEventType.TOUCH_END, this._onTurnleft, this);

        this.turnRightNode.on(SystemEventType.TOUCH_START, this._onTurnright, this);
        this.turnRightNode.on(SystemEventType.TOUCH_CANCEL, this._onTurnright, this);
        this.turnRightNode.on(SystemEventType.TOUCH_MOVE, this._onTurnright, this);
        this.turnRightNode.on(SystemEventType.TOUCH_END, this._onTurnright, this);
    }

    removeEvents () {
        this.forwardNode.off(SystemEventType.TOUCH_START, this._onForward, this);
        this.forwardNode.off(SystemEventType.TOUCH_CANCEL, this._onForward, this);
        this.forwardNode.off(SystemEventType.TOUCH_MOVE, this._onForward, this);
        this.forwardNode.off(SystemEventType.TOUCH_END, this._onForward, this);

        this.backwardNode.off(SystemEventType.TOUCH_START, this._onBackward, this);
        this.backwardNode.off(SystemEventType.TOUCH_CANCEL, this._onBackward, this);
        this.backwardNode.off(SystemEventType.TOUCH_MOVE, this._onBackward, this);
        this.backwardNode.off(SystemEventType.TOUCH_END, this._onBackward, this);

        this.turnleftNode.off(SystemEventType.TOUCH_START, this._onTurnleft, this);
        this.turnleftNode.off(SystemEventType.TOUCH_CANCEL, this._onTurnleft, this);
        this.turnleftNode.off(SystemEventType.TOUCH_MOVE, this._onTurnleft, this);
        this.turnleftNode.off(SystemEventType.TOUCH_END, this._onTurnleft, this);

        this.turnRightNode.off(SystemEventType.TOUCH_START, this._onTurnright, this);
        this.turnRightNode.off(SystemEventType.TOUCH_CANCEL, this._onTurnright, this);
        this.turnRightNode.off(SystemEventType.TOUCH_MOVE, this._onTurnright, this);
        this.turnRightNode.off(SystemEventType.TOUCH_END, this._onTurnright, this);
    }

    private _onForward (event: EventTouch) {
        console.log(event);
        this._setValue(event.type as SystemEventType, EFourDirType.FORWARD);
    }

    private _onBackward (event: EventTouch) {
        console.log(event);
        this._setValue(event.type as SystemEventType, EFourDirType.BACKWARD);
    }

    private _onTurnleft (event: EventTouch) {
        console.log(event);
        this._setValue(event.type as SystemEventType, EFourDirType.TURNLEFT);
    }

    private _onTurnright (event: EventTouch) {
        console.log(event);
        this._setValue(event.type as SystemEventType, EFourDirType.TURNRIGHT);
    }

    private _setValue (type: SystemEventType, dirType: EFourDirType) {
        let _btnState: EButtonState = EButtonState.MOVE;
        if (type == SystemEventType.TOUCH_START) {
            _btnState = EButtonState.START;
        } else if (type == SystemEventType.TOUCH_END) {
            _btnState = EButtonState.END;
        } else if (type == SystemEventType.TOUCH_CANCEL) {
            _btnState = EButtonState.CANCEL;
        }

        let _t = dirType << _btnState;
        if (dirType == EFourDirType.FORWARD) {
            this._forward = _t;
        } else if (dirType == EFourDirType.BACKWARD) {
            this._backward = _t;
        } else if (dirType == EFourDirType.TURNLEFT) {
            this._turnleft = _t;
        } else {
            this._turnright = _t;
        }
    }

}
