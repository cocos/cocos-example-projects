import { _decorator, Component, Node, systemEvent, SystemEventType, Touch, Vec2, Vec3 } from "cc";
const { ccclass, property, menu } = _decorator;

// 操作半径
const TOUCH_RANGE = 40;
const v2_0 = new Vec2();

@ccclass("FALL-GUYS.RockerCtrl")
@menu('demo/fall-guys/RockerCtrl')
export class RockerCtrl extends Component {
    @property(Node)
    ctrlSprite: Node = null!;

    moveX = 0;
    moveZ = 0;

    private _isTouch = false;

    start () {
        this.ctrlSprite.setPosition(Vec3.ZERO);
        systemEvent.on(SystemEventType.TOUCH_START, this.touchStart, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.touchMove, this);
        systemEvent.on(SystemEventType.TOUCH_END, this.touchEnd, this);
    }

    onDestroy () {
        systemEvent.off(SystemEventType.TOUCH_START, this.touchStart, this);
        systemEvent.off(SystemEventType.TOUCH_MOVE, this.touchMove, this);
        systemEvent.off(SystemEventType.TOUCH_END, this.touchEnd, this);
    }

    touchStart (touch: Touch) {
        touch.getUILocation(v2_0);
        const wp = this.node.worldPosition;
        v2_0.x -= wp.x; v2_0.y -= wp.y;
        if (Math.abs(v2_0.x) <= TOUCH_RANGE && Math.abs(v2_0.y) <= TOUCH_RANGE) {
            this.moveX = -v2_0.x; this.moveZ = v2_0.y;
            this.ctrlSprite.setPosition(v2_0.x, v2_0.y, 0);
            this._isTouch = true;
        }
    }

    touchMove (touch: Touch) {
        if (!this._isTouch) return;

        touch.getUILocation(v2_0);
        const wp = this.node.worldPosition;
        v2_0.x -= wp.x; v2_0.y -= wp.y;
        if (Math.abs(v2_0.x) > TOUCH_RANGE || Math.abs(v2_0.y) > TOUCH_RANGE) {
            v2_0.normalize();
            v2_0.multiplyScalar(TOUCH_RANGE);
        }
        this.ctrlSprite.setPosition(v2_0.x, v2_0.y, 0);
        this.moveX = -v2_0.x; this.moveZ = v2_0.y;
    }

    touchEnd (touch: Touch) {
        this._isTouch = false;
        this.ctrlSprite.setPosition(Vec3.ZERO);
        this.moveX = this.moveZ = 0;
    }
}
