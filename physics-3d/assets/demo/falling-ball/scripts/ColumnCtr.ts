import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Quat, EventTouch, Touch, Vec3 } from "cc";
import { v2_t, quat_t, v3_t } from "./TempConst";
const { ccclass, property, menu } = _decorator;

@ccclass("FALLING-BALL.ColumnCtr")
@menu("demo/falling-ball/ColumnCtr")
export class ColumnCtr extends Component {

    @property
    rotFactor = 0.75;

    onEnable () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onDisable () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onKeyDown (event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {
            Quat.fromEuler(quat_t, 0, 3, 0);
        } else if (event.keyCode == KeyCode.KEY_D) {
            Quat.fromEuler(quat_t, 0, -3, 0);
        }
        this.node.rotate(quat_t);
    }

    onTouchMove (touch: Touch, event: EventTouch) {
        touch.getDelta(v2_t);
        if (v2_t.x != 0) {
            Quat.fromEuler(quat_t, 0, v2_t.x * this.rotFactor, 0);
            this.node.rotate(quat_t);
        }
    }

    reset () {
        const cnode = this.node.children[0];
        cnode.worldPosition = Vec3.ZERO;
        cnode.worldRotation = Quat.IDENTITY;

        for (let i = 0; i < this.node.children.length; i++) {
            const cnode = this.node.children[i];
            v3_t.set(0, i * -8, 0);
            cnode.worldPosition = v3_t;
        }
    }
}
