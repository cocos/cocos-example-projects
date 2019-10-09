import { _decorator, Component, Node, SystemEventType, EventTouch, systemEvent, EventKeyboard, macro } from "cc";
import { EFourDirType, EButtonState } from "../const/EnumDefine";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property } = _decorator;

/**
 * 四个方向按钮的控制器
 */

@ccclass("FourDirButtons")
export class FourDirButtons extends Component {

    public forwardNode: Node = null;

    public backwardNode: Node = null;

    public turnleftNode: Node = null;

    public turnRightNode: Node = null;

    private _button = {};

    // public readonly  

    public check (dirType: EFourDirType, buttonState: EButtonState) {
        return this._button[dirType] & (dirType << buttonState);
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

        if (cc.sys.isBrowser) {
            systemEvent.on(SystemEventType.KEY_DOWN, this._onKeyDown, this);
            systemEvent.on(SystemEventType.KEY_UP, this._onKeyUp, this);
        }
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

        if (cc.sys.isBrowser) {
            systemEvent.off(SystemEventType.KEY_DOWN, this._onKeyDown, this);
            systemEvent.off(SystemEventType.KEY_UP, this._onKeyUp, this);
        }
    }

    private _onForward (event: EventTouch) {
        this._setValue(event.type as SystemEventType, EFourDirType.FORWARD);
    }

    private _onBackward (event: EventTouch) {
        this._setValue(event.type as SystemEventType, EFourDirType.BACKWARD);
    }

    private _onTurnleft (event: EventTouch) {
        this._setValue(event.type as SystemEventType, EFourDirType.TURNLEFT);
    }

    private _onTurnright (event: EventTouch) {
        this._setValue(event.type as SystemEventType, EFourDirType.TURNRIGHT);
    }

    private _setValue (type: SystemEventType, dirType: EFourDirType) {
        let _btnState: EButtonState = EButtonState.TOUCH_MOVE;
        if (type == SystemEventType.TOUCH_START) {
            _btnState = EButtonState.TOUCH_START;
        } else if (type == SystemEventType.TOUCH_END) {
            _btnState = EButtonState.TOUCH_END;
        } else if (type == SystemEventType.TOUCH_CANCEL) {
            _btnState = EButtonState.TOUCH_CANCEL;
        }

        this._button[dirType] = dirType << _btnState;
    }

    private _onKeyDown (event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._setValue(SystemEventType.TOUCH_START, EFourDirType.FORWARD);
        } else if (event.keyCode == macro.KEY.a) {
            this._setValue(SystemEventType.TOUCH_START, EFourDirType.TURNLEFT);
        } else if (event.keyCode == macro.KEY.s) {
            this._setValue(SystemEventType.TOUCH_START, EFourDirType.BACKWARD);
        } else if (event.keyCode == macro.KEY.d) {
            this._setValue(SystemEventType.TOUCH_START, EFourDirType.TURNRIGHT);
        }
    }

    private _onKeyUp (event: EventKeyboard) {
        if (event.keyCode == macro.KEY.w) {
            this._setValue(SystemEventType.TOUCH_END, EFourDirType.FORWARD);
        } else if (event.keyCode == macro.KEY.a) {
            this._setValue(SystemEventType.TOUCH_END, EFourDirType.TURNLEFT);
        } else if (event.keyCode == macro.KEY.s) {
            this._setValue(SystemEventType.TOUCH_END, EFourDirType.BACKWARD);
        } else if (event.keyCode == macro.KEY.d) {
            this._setValue(SystemEventType.TOUCH_END, EFourDirType.TURNRIGHT);
        }
    }

}
