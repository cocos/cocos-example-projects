import { _decorator, Component, Node, input, Input, EventMouse, Vec3, sys, EventTouch } from 'cc';
const { ccclass, property, menu } = _decorator;

const v3_0 = new Vec3();

@ccclass('CHARACTER.BearingController')
@menu("experiment/character-controller/BearingController")
export class BearingController extends Component {

    @property
    invScaleFator = 1000;

    @property({ type: Node })
    fullScreen: Node = null;

    protected _bind: () => {};
    protected _bind2: () => {};

    constructor () {
        super();
    }

    protected onEnable () {
        if (sys.isBrowser) {
            this._bind = this.onFullScreenChange.bind(this);
            document.addEventListener('fullscreenchange', this._bind, false);
        }
        this.fullScreen.children[0].on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    protected onDisable () {
        if (sys.isBrowser) {
            document.removeEventListener('fullscreenchange', this._bind, false);
        }
        this.fullScreen.children[0].off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    protected onTouchStart (touch: EventTouch) {
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element['mozRequestPointerLock'] || element['webkitRequestPointerLock'];
        element.requestPointerLock();
        element.requestFullscreen = element.requestFullscreen || element.requestFullscreen || element[`mozRequestFullScreen`] || element[`webkitRequestFullscreen`];
        element.requestFullscreen();
    }

    protected onFullScreenChange () {
        this.fullScreen.active = !this.fullScreen.active;
        if (this.fullScreen.active) {
            if (sys.isBrowser) {
                document.removeEventListener('mousemove', this._bind2, false);
            } else {
                input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            }
        } else {
            if (sys.isBrowser) {
                this._bind2 = this.onMouseMove.bind(this);
                document.addEventListener('mousemove', this._bind2, false);
            } else {
                input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            }
        }
    }

    protected onMouseMove (event: EventMouse | MouseEvent) {
        let deltaX = 0;
        if (sys.isBrowser) {
            deltaX = event.movementX || event[`mozMovementX`] || event[`webkitMovementX`] || 0;
        } else {
            deltaX = (event as EventMouse).getDeltaX();
        }
        const eluerY = this.node.eulerAngles.y;
        v3_0.set(0, eluerY + -deltaX * Math.abs(deltaX) / this.invScaleFator, 0);
        this.node.eulerAngles = v3_0;
    }

}
