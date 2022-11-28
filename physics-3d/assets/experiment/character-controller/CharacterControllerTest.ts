import { _decorator, Component, Node, EventKeyboard, input, Input, KeyCode, Vec3, AnimationComponent, EventMouse, EventType, sys, Quat } from 'cc';
import { CharacterController } from './CharacterController';
const { ccclass, property, menu } = _decorator;

const v3_0 = new Vec3();
const quat_0 = new Quat();
let cctInstance: CharacterControllerTest = null;

@ccclass('CHARACTER.CharacterControllerTest')
@menu('experiment/character-controller/CharacterControllerTest')
export class CharacterControllerTest extends Component {

    @property({ type: CharacterController })
    character: CharacterController = null;

    @property({ type: AnimationComponent })
    animation: AnimationComponent = null;

    @property({ type: Node })
    mainBearing: Node = null;

    @property({ type: Node })
    refBearing: Node = null;

    @property
    speed = 0.1;

    @property
    shiftScale = 2;

    @property
    rotateFactor = 0.1;

    protected _isJump: boolean = false;
    protected _stateX: -1 | 0 | 1 = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: -1 | 0 | 1 = 0;
    protected _shiftFactor = 1;
    protected _combatFlag = 0 | 1 | 2; // 0 none, 1 punch (attack), 2 squat
    protected _isAltDown: boolean = false;

    /** 
     * 0 is idle
     * 1 << 0 cannot moving\rotate
     * 1 << 1 cannot jump 
     * 1 << 2 cannot punch
     * 1 << 3 cannot squat
     */
    protected _constraint = 0;

    constructor () {
        super();
        cctInstance = this;
    }

    protected onEnable () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        if (sys.isBrowser) {
            document.addEventListener('mousedown', this.onMouseDown2, false);
        } else {
            input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        }
    }

    protected onDisable () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        if (sys.isBrowser) {
            document.removeEventListener('mousedown', this.onMouseDown2, false);
        } else {
            input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        }
    }

    protected onKeyDown (event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_W) {
            this._stateZ = 1;
        } else if (event.keyCode == KeyCode.KEY_S) {
            this._stateZ = -1;
        } else if (event.keyCode == KeyCode.KEY_A) {
            this._stateX = 1;
        } else if (event.keyCode == KeyCode.KEY_D) {
            this._stateX = -1;
        } else if (event.keyCode == KeyCode.SPACE) {
            this._isJump = true;
        } else if (event.keyCode == KeyCode.SHIFT_LEFT ) {
            this._shiftFactor = this.shiftScale;
        } else if (event.keyCode == KeyCode.ALT_LEFT) {
            this._isAltDown = true;
        } else if (event.keyCode == KeyCode.KEY_Z) {
            this._combatFlag = 2;
        }
    }

    protected onKeyUp (event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_W || event.keyCode == KeyCode.KEY_S) {
            this._stateZ = 0;
        } else if (event.keyCode == KeyCode.KEY_D || event.keyCode == KeyCode.KEY_A) {
            this._stateX = 0;
        } else if (event.keyCode == KeyCode.SPACE) {
            this._isJump = false;
        } else if (event.keyCode == KeyCode.SHIFT_LEFT ) {
            this._shiftFactor = 1;
        } else if (event.keyCode == KeyCode.ALT_LEFT) {
            this._isAltDown = false;
        }
    }

    protected onMouseDown (event: EventMouse) {
        if (event.getButton() == EventMouse.BUTTON_RIGHT) {
            this._combatFlag = 1;
        }
    }

    protected onMouseDown2 (event: MouseEvent) {
        if (event.button == EventMouse.BUTTON_RIGHT) {
            cctInstance._combatFlag = 1;
        }
    }

    protected start () {
        if (this.character == null) {
            this.character = this.getComponent(CharacterController);
        }
    }

    protected update () {
        if (this._combatFlag) {
            if (!(this._constraint & 1 << 2) && this._combatFlag == 1) {
                this.animation.play('cocos_anim_attack');
                this._constraint = -1;
                const that = this;
                const as = this.animation.getState('cocos_anim_attack');
                as.once(EventType.FINISHED, () => {
                    that._constraint = 0;
                    that.animation.play('cocos_anim_idle');
                })
            } else if (!(this._constraint & 1 << 3) && this._combatFlag == 2) {
                this.animation.play('cocos_anim_squat');
                this._constraint = -1;
                const that = this;
                const as = this.animation.getState('cocos_anim_squat');
                as.once(EventType.FINISHED, () => {
                    that._constraint = 0;
                    that.animation.play('cocos_anim_idle');
                })
            }
            this._combatFlag = 0;
        } else {
            if (!(this._constraint & 1 << 1) && this._isJump) {
                if (this.character.onGround) {
                    this.character.jump();

                    this._constraint |= (1 << 3) + (1 << 2) + (1 << 1);
                    this.animation.play('cocos_anim_jump_static');
                    const as = this.animation.getState('cocos_anim_jump_static');
                    const that = this;
                    as.once(EventType.FINISHED, (...args) => {
                        that._constraint = 0;
                        that.animation.play('cocos_anim_idle');
                    })
                }
            }

            if (!(this._constraint & 1 << 0) && !this._isAltDown) {
                const qm = this.mainBearing.rotation;
                const qf = this.refBearing.rotation;
                if (!Quat.equals(qm, qf)) {
                    Quat.slerp(quat_0, qm, qf, this.rotateFactor);
                    this.mainBearing.worldRotation = quat_0;
                }
            }

            if (!(this._constraint & 1 << 0) && (this._stateX || this._stateZ)) {
                const ss = this.speed * this._shiftFactor;
                v3_0.set(this._stateX * ss, 0, this._stateZ * ss);
                Vec3.transformQuat(v3_0, v3_0, this.mainBearing.worldRotation);
                this.character.move(v3_0);

                const asJump = this.animation.getState('cocos_anim_jump_static');
                if (!asJump.isPlaying) {
                    if (this._shiftFactor == 1) {
                        const as = this.animation.getState('cocos_anim_walk');
                        if (!as.isPlaying) {
                            this.animation.crossFade('cocos_anim_walk', 0.2);
                        }
                    } else {
                        const as = this.animation.getState('cocos_anim_run');
                        if (!as.isPlaying) {
                            this.animation.crossFade('cocos_anim_run', 0.2);
                        }
                    }
                }
            } else {
                if (this._constraint == 0) {
                    const as = this.animation.getState('cocos_anim_idle');
                    if (!as.isPlaying) {
                        this.animation.crossFade('cocos_anim_idle', 0.2);
                    }
                }
            }

        }

    }
}
