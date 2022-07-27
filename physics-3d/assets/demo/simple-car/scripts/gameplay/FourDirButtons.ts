import { _decorator, Component, Node, EventTouch, input, Input, EventKeyboard, macro } from "cc";
import { EFourDirType, EButtonState } from "../const/EnumDefine";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property, menu } = _decorator;

const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    w: 'w'.charCodeAt(0),
    s: 's'.charCodeAt(0),
    a: 'a'.charCodeAt(0),
    d: 'd'.charCodeAt(0),
};

/**
 * 四个方向按钮的控制器
 */

@ccclass("SIMPLE-CAR.FourDirButtons")
@menu("demo/simple-car/FourDirButtons")
export class FourDirButtons extends Component {

    public forwardNode: Node = null!;

    public backwardNode: Node = null!;

    public turnleftNode: Node = null!;

    public turnRightNode: Node = null!;

    private _button:any = {};

    public check (dirType: EFourDirType, buttonState: EButtonState) {
        return this._button[dirType] & (dirType << buttonState);
    }

    onLoad () {
        this.forwardNode = this.node.getChildByName('Forward') as Node;
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
        this.forwardNode.on(Input.EventType.TOUCH_START, this._onForward, this);
        this.forwardNode.on(Input.EventType.TOUCH_CANCEL, this._onForward, this);
        this.forwardNode.on(Input.EventType.TOUCH_MOVE, this._onForward, this);
        this.forwardNode.on(Input.EventType.TOUCH_END, this._onForward, this);

        this.backwardNode.on(Input.EventType.TOUCH_START, this._onBackward, this);
        this.backwardNode.on(Input.EventType.TOUCH_CANCEL, this._onBackward, this);
        this.backwardNode.on(Input.EventType.TOUCH_MOVE, this._onBackward, this);
        this.backwardNode.on(Input.EventType.TOUCH_END, this._onBackward, this);

        this.turnleftNode.on(Input.EventType.TOUCH_START, this._onTurnleft, this);
        this.turnleftNode.on(Input.EventType.TOUCH_CANCEL, this._onTurnleft, this);
        this.turnleftNode.on(Input.EventType.TOUCH_MOVE, this._onTurnleft, this);
        this.turnleftNode.on(Input.EventType.TOUCH_END, this._onTurnleft, this);

        this.turnRightNode.on(Input.EventType.TOUCH_START, this._onTurnright, this);
        this.turnRightNode.on(Input.EventType.TOUCH_CANCEL, this._onTurnright, this);
        this.turnRightNode.on(Input.EventType.TOUCH_MOVE, this._onTurnright, this);
        this.turnRightNode.on(Input.EventType.TOUCH_END, this._onTurnright, this);

        input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    removeEvents () {
        this.forwardNode.off(Input.EventType.TOUCH_START, this._onForward, this);
        this.forwardNode.off(Input.EventType.TOUCH_CANCEL, this._onForward, this);
        this.forwardNode.off(Input.EventType.TOUCH_MOVE, this._onForward, this);
        this.forwardNode.off(Input.EventType.TOUCH_END, this._onForward, this);

        this.backwardNode.off(Input.EventType.TOUCH_START, this._onBackward, this);
        this.backwardNode.off(Input.EventType.TOUCH_CANCEL, this._onBackward, this);
        this.backwardNode.off(Input.EventType.TOUCH_MOVE, this._onBackward, this);
        this.backwardNode.off(Input.EventType.TOUCH_END, this._onBackward, this);

        this.turnleftNode.off(Input.EventType.TOUCH_START, this._onTurnleft, this);
        this.turnleftNode.off(Input.EventType.TOUCH_CANCEL, this._onTurnleft, this);
        this.turnleftNode.off(Input.EventType.TOUCH_MOVE, this._onTurnleft, this);
        this.turnleftNode.off(Input.EventType.TOUCH_END, this._onTurnleft, this);

        this.turnRightNode.off(Input.EventType.TOUCH_START, this._onTurnright, this);
        this.turnRightNode.off(Input.EventType.TOUCH_CANCEL, this._onTurnright, this);
        this.turnRightNode.off(Input.EventType.TOUCH_MOVE, this._onTurnright, this);
        this.turnRightNode.off(Input.EventType.TOUCH_END, this._onTurnright, this);

        input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _onForward (event: EventTouch) {
        this._setValue(event.type as Node.EventType, EFourDirType.FORWARD);
    }

    private _onBackward (event: EventTouch) {
        this._setValue(event.type as Node.EventType, EFourDirType.BACKWARD);
    }

    private _onTurnleft (event: EventTouch) {
        this._setValue(event.type as Node.EventType, EFourDirType.TURNLEFT);
    }

    private _onTurnright (event: EventTouch) {
        this._setValue(event.type as Node.EventType, EFourDirType.TURNRIGHT);
    }

    private _setValue (type: Node.EventType, dirType: EFourDirType) {
        let _btnState: EButtonState = EButtonState.TOUCH_MOVE;
        if (type == Input.EventType.TOUCH_START) {
            _btnState = EButtonState.TOUCH_START;
        } else if (type == Input.EventType.TOUCH_END) {
            _btnState = EButtonState.TOUCH_END;
        } else if (type == Input.EventType.TOUCH_CANCEL) {
            _btnState = EButtonState.TOUCH_CANCEL;
        }

        this._button[dirType] = dirType << _btnState;
    }

    private _onKeyDown (event: EventKeyboard) {
        if (event.keyCode == KEYCODE.w || event.keyCode == KEYCODE.W) {
            this._setValue(Input.EventType.TOUCH_START, EFourDirType.FORWARD);
        } else if (event.keyCode == KEYCODE.a || event.keyCode == KEYCODE.A) {
            this._setValue(Input.EventType.TOUCH_START, EFourDirType.TURNLEFT);
        } else if (event.keyCode == KEYCODE.s || event.keyCode == KEYCODE.S) {
            this._setValue(Input.EventType.TOUCH_START, EFourDirType.BACKWARD);
        } else if (event.keyCode == KEYCODE.d || event.keyCode == KEYCODE.D) {
            this._setValue(Input.EventType.TOUCH_START, EFourDirType.TURNRIGHT);
        }
    }

    private _onKeyUp (event: EventKeyboard) {
        if (event.keyCode == KEYCODE.w || event.keyCode == KEYCODE.W) {
            this._setValue(Input.EventType.TOUCH_END, EFourDirType.FORWARD);
        } else if (event.keyCode == KEYCODE.a || event.keyCode == KEYCODE.A) {
            this._setValue(Input.EventType.TOUCH_END, EFourDirType.TURNLEFT);
        } else if (event.keyCode == KEYCODE.s || event.keyCode == KEYCODE.S) {
            this._setValue(Input.EventType.TOUCH_END, EFourDirType.BACKWARD);
        } else if (event.keyCode == KEYCODE.d || event.keyCode == KEYCODE.D) {
            this._setValue(Input.EventType.TOUCH_END, EFourDirType.TURNRIGHT);
        }
    }

}
