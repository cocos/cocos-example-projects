import { _decorator, Component, Node, Prefab, instantiate, Vec3, NodePool, LabelComponent, math, find, AnimationComponent } from 'cc';
import { PlayerController } from './PlayerController';
import {GameDefines, GameState } from './GameDefines';
const { ccclass, property } = _decorator;

const tempVec3_a = new Vec3();


@ccclass('GameManager')
export class GameManager extends Component {

    @property({type: Prefab})
    public straitFloorPrfb: Prefab = null;

    @property({type: Prefab})
    public coinPrfb: Prefab = null;
    @property({type: Prefab})
    public roadBlockPrfb: Prefab = null;

    @property({type: PlayerController})
    public playerCtrl: PlayerController = null;
    @property({type: LabelComponent})
    public coinScoreLabel: LabelComponent = null;

    @property({type: Node})
    public initPanel: Node = null;
    @property({type: Node})
    public playingPanel: Node = null;
    @property({type: Node})
    public endPanel: Node = null;

    private _coinPool: NodePool = new NodePool();
    private _coinNum: number = 0;
    private _straitFloorPool: NodePool = new NodePool();
    private _roadBlockPool: NodePool = new NodePool();
    private _checkPassedTime: number = 0;
    private _checkInterval: number = 1;
    private _activeFloors: Node[] = [];
    private _curState: GameState = GameState.INIT;

    get coinNum() {
        return this._coinNum;
    }

    set coinNum(value: number) {
        this._coinNum = value;
        this.coinScoreLabel.string = ''+value;
    }

    set curState(value: GameState) {
        switch(value) {
            case GameState.INIT:
                this.initPanel.active = true;
                this.playingPanel.active = false;
                this.endPanel.active = false;
                this.reset();
                break;
            case GameState.PLAYING:
                this.initPanel.active = false;
                this.playingPanel.active = true;
                this.coinNum = 0;

                break;
            case GameState.END:
                this.playingPanel.active = false;
                this.endPanel.active = true;
                break;
        }

        this._curState = value;
        this.playerCtrl.onGameStateChanged(value);
    }

    get curState() {
        return this._curState;
    }

    start () {
        this.curState = GameState.INIT;
        this.playerCtrl.onTriggerCoin = this.onCoinTriggered.bind(this);
        this.playerCtrl.onTriggerBlock = this.onBlockTriggered.bind(this);
    }

    reset() {
        // clear all
        this._activeFloors.forEach((floorNode: Node) => {
            this.destroyFloor(floorNode);
        });
        this._activeFloors = [];

        // init
        for (let i = 0; i < GameDefines.maxActiveFloor; i++) {
            const posZ = i * GameDefines.floorLength;
            let needItem = false;
            if (i > 1) {
                needItem = true;
            }

            this.generateFloor(tempVec3_a.set(0, 0, posZ), needItem);
        }
    }

    destroyFloor(floorNode: Node) {
        for (let j = 0; j < floorNode.children.length; j++) {
            const child = floorNode.children[j];
            if (child.name === GameDefines.CoinNodeName) {
                child.parent = null;
                this._coinPool.put(child);
            } else if (child.name === GameDefines.BlockNodeName) {
                child.parent = null;
                this._roadBlockPool.put(child);
            }
            
        }
        this._straitFloorPool.put(floorNode);
    }

    generateFloor(pos: Vec3, generateItem: boolean = false) {
        let floorNode = this.createStraitFloor(pos);
        this._activeFloors.push(floorNode);

        if (generateItem) {
            const generateType = math.randomRangeInt(0, 3);
            if (generateType === 1) {
                this.createCoin(floorNode, tempVec3_a.set(this.randomXPos(), 1, 0));
            } else if (generateType === 2) {
                this.createRoadBlock(floorNode, tempVec3_a.set(this.randomXPos(), 0, 0));
            }
        }
    }

    randomXPos() {
        const posXPool: number[] = [GameDefines.leftLineX, GameDefines.middleLineX, GameDefines.rightLineX];
        const index = math.randomRangeInt(0, 3);
        const posX: number = posXPool[index];

        return posX;
    }

    createStraitFloor(pos: Vec3) {
        let straitFloorNode: Node = null;
        if (this._straitFloorPool.size() > 0) {
            straitFloorNode = this._straitFloorPool.get();
        } else {
            straitFloorNode = instantiate(this.straitFloorPrfb);
        }

        straitFloorNode.setPosition(pos);
        straitFloorNode.parent = this.node;

        return straitFloorNode;
    }

    createCoin(parent: Node, localPos: Vec3) {
        let coinNode: Node = null;
        if (this._coinPool.size() > 0) {
            coinNode = this._coinPool.get();
        } else {
            coinNode = instantiate(this.coinPrfb);
        }
        coinNode.setPosition(localPos);
        coinNode.parent = parent;

        return coinNode;
    }

    createRoadBlock(parent: Node, localPos: Vec3) {
        let roadBlock: Node = null;
        if (this._roadBlockPool.size() > 0) {
            roadBlock = this._roadBlockPool.get();
        } else {
            roadBlock = instantiate(this.roadBlockPrfb);
        }

        roadBlock.setPosition(localPos);
        roadBlock.parent = parent;

        const animComp = roadBlock.getComponent(AnimationComponent);
        const downName = 'block_down';
        const state = animComp.getState(downName);
        state.setTime(0);
        state.sample();

        return roadBlock;
    }

    onCoinTriggered(coinNode: Node) {
        this._coinNum ++;
        this.coinScoreLabel.string = '' + this._coinNum;
        this._coinPool.put(coinNode);
    }

    onBlockTriggered(blockNode: Node) {
        this.curState = GameState.END;
    }

    checkToGenerateElem(deltaTime: number) {
        this._checkPassedTime += deltaTime;
        if (this._checkPassedTime > this._checkInterval) {
            // 隐藏在人物身后的Floor
            let backIndex = 0;
            for (let i = 0; i < this._activeFloors.length; i++) {
                const floor = this._activeFloors[i];
                if (floor.position.z > (this.playerCtrl.node.position.z - GameDefines.floorLength)) {
                    backIndex = i;
                    break;
                }
            }

            if (backIndex > 0) {
                for (let i = 0; i < backIndex; i++) {
                    const first: Node = this._activeFloors.shift();
                    this.destroyFloor(first);
                    const last = this._activeFloors[this._activeFloors.length - 1];
                    const posZ = last.position.z + GameDefines.floorLength;
                    this.generateFloor(tempVec3_a.set(0, 0, posZ), true);
                }
            }

            this._checkPassedTime = 0;
        }
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this.checkToGenerateElem(deltaTime);
    }

    // button events
    onStartButtonClicked() {
        this.curState = GameState.PLAYING;
    }

    onRestartButtonClicked() {
        this.curState = GameState.INIT;
    }
}
