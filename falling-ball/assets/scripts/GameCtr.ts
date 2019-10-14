import { _decorator, Component, Node, LabelComponent, ButtonComponent, EventHandler } from "cc";
import { ColumnCtr } from "./ColumnCtr";
import { parseTime2String } from "./TempConst";
import { BallCtr } from "./BallCtr";
import { FloorFlagCtr } from "./FloorFlagCtr";
import { CameraFollow } from "./CameraFollow";
const { ccclass, property } = _decorator;

enum EGameSate {
    LOBBY,
    GAMING,
    GAMEOVER
}

@ccclass("GameCtr")
export class GameCtr extends Component {

    @property({ type: Node })
    gamePanel: Node = null;

    @property({ type: Node })
    loginPanel: Node = null;

    @property({ type: Node })
    overPanel: Node = null;

    @property({ type: CameraFollow })
    cameraCtr: CameraFollow = null;

    @property({ type: ColumnCtr })
    columnCtr: ColumnCtr = null;

    @property({ type: BallCtr })
    ballCtr: BallCtr = null;

    @property({ type: FloorFlagCtr })
    floorFlagCtr: FloorFlagCtr = null;

    @property
    totalSecond: number = 90;

    _tick = 0;
    _intervalId = 0;

    _state: EGameSate = EGameSate.LOBBY;

    _timingLb: LabelComponent = null;
    _scoreLb: LabelComponent = null;

    start () {
        const startBtn = this.loginPanel.getChildByName('StartBtn').getComponent(ButtonComponent);
        const startEvent = new EventHandler();
        startEvent.target = this.node as Node;
        startEvent.component = "GameCtr";
        startEvent.handler = "gameStart";
        startBtn.clickEvents.push(startEvent);

        const backToLoginBtn = this.overPanel.getChildByName('BackBtn').getComponent(ButtonComponent);
        const backToLoginEvent = new EventHandler();
        backToLoginEvent.target = this.node as Node;
        backToLoginEvent.component = "GameCtr";
        backToLoginEvent.handler = "gameBackToLogin";
        backToLoginBtn.clickEvents.push(backToLoginEvent);

        const RestartBtn = this.overPanel.getChildByName('RestartBtn').getComponent(ButtonComponent);
        const restartEvent = new EventHandler();
        restartEvent.target = this.node as Node;
        restartEvent.component = "GameCtr";
        restartEvent.handler = "gameRestart";
        RestartBtn.clickEvents.push(restartEvent);

        /** hack */
        this.columnCtr.enabled = false;
        this._timingLb = this.gamePanel.getChildByName('TimingLabel').getComponent(LabelComponent);
        this._scoreLb = this.gamePanel.getChildByName('ScoreLabel').getComponent(LabelComponent);

        this._timingLb.string = parseTime2String(this.totalSecond);
        const score = localStorage.getItem('score');
        if (score != null) {
            this._scoreLb.string = score;
        }
    }

    gameStart () {
        this.columnCtr.enabled = true;
        this.loginPanel.active = false;
        this._tick = 0;
        this._timingLb.string = parseTime2String(this.totalSecond);
        this._scoreLb.string = '0';
        this._intervalId = setInterval(this.gameTick.bind(this), 1000);
        this._state = EGameSate.GAMING;
    }

    gameRestart () {
        this.overPanel.active = false;
        this.ballCtr.reset();
        this.columnCtr.reset();
        this.floorFlagCtr.reset();
        this.cameraCtr.reset();
        this.gameStart();
    }

    gameBackToLogin () {
        this.loginPanel.active = true;
        this.overPanel.active = false;
        this.ballCtr.reset();
        this.columnCtr.reset();
        this.floorFlagCtr.reset();
        this.cameraCtr.reset();
        this.floorFlagCtr.reset();

        this._timingLb.string = parseTime2String(this.totalSecond);
        const score = localStorage.getItem('score');
        if (score != null) {
            this._scoreLb.string = score;
        }
    }

    private gameTick () {
        this._tick++;
        const dt = this.totalSecond - this._tick;
        if (dt < 0 || this.ballCtr.hitRed) {
            this.columnCtr.enabled = false;

            if ((this.ballCtr.isDeadlock || this.ballCtr.hitRed) && this._state != EGameSate.GAMEOVER) {
                /** GAME OVER */
                this._state = EGameSate.GAMEOVER;
                clearInterval(this._intervalId);
                this.overPanel.active = true;
                this.columnCtr.enabled = false;

                const score = localStorage.getItem('score');
                if (score != null) {
                    let s0 = parseInt(score);
                    let s1 = parseInt(this._scoreLb.string);
                    if (s1 > s0) {
                        localStorage.setItem('score', this._scoreLb.string);
                    }
                } else {
                    localStorage.setItem('score', this._scoreLb.string);
                }
            }

        } else {
            this._timingLb.string = parseTime2String(dt);
        }
    }
}
