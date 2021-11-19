import { _decorator, Component, Node, Prefab, instantiate, Vec3, Quat, tween, EventTouch, 
    systemEvent, SystemEvent, EventMouse, CameraComponent, geometry, PhysicsSystem, loader, JsonAsset, ModelComponent, Texture2D, js, director, Vec2, game, find } from 'cc';
const { ccclass, property } = _decorator;

const { Ray } = geometry;
const tempQuat_a: Quat = new Quat();

interface ICoverData {
    name: string;
    coverImgUrl: string;
    sceneUrl: string;
}

@ccclass('Lobby')
export class Lobby extends Component {
    @property({type: Prefab})
    public coverPrfb: Prefab = null;
    @property({type: CameraComponent})
    public mainCamera: CameraComponent = null;

    private coverWidth: number = 1;
    private _coverList: Node[] = [];
    private _coverData: ICoverData[] = [];
    private _curIndex = 0;
    private _isLoading = false;
    start () {
        const persistCanvas = find('PersistCanvas')
        persistCanvas.active = false;

        // Your initialization goes here.
        this.loadCovers();
        //this.tweenToIndex(this._curIndex, true);


        //鼠标监听
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        
        //触摸监听
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    loadCovers() {
        loader.loadRes('games.json', JsonAsset, (err, jsonObj) => {
            if (Array.isArray(jsonObj.json)) {
                this.generateCovers(jsonObj.json);
            }
        });
    }

    generateCovers(coverData:ICoverData[]) {

        this._coverData = coverData;
        const coverNum = Math.max(coverData.length, 5); // 为了好看，默认至少五个
        for (let i = 0; i < coverNum; i++) {
            
            const coverNode: Node = instantiate(this.coverPrfb);
            coverNode.name = ''+i;
            coverNode.parent = this.node;

            if (i < coverData.length) {
                const data = coverData[i];

                const modelComp = coverNode.getComponent(ModelComponent);
                const mat = modelComp.material;
                loader.loadRes(data.coverImgUrl, Texture2D, (err, texture: Texture2D) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    mat.setProperty('mainTexture', texture);
                    if (i === coverData.length - 1) {
                        this.tweenToIndex(this._curIndex, true);
                    }
                })
            }

            this._coverList.push(coverNode);
        }

        
    }

    tweenToIndex(index: number, immediate: boolean = false) {
        if (index < 0 || index >= this._coverList.length) {
            return;
        }

        this._curIndex = index;

        for(let i = 0; i < this._coverList.length; i++) {
            const coverNode = this._coverList[i];
            const pos = new Vec3();
            const rot: Quat = new Quat();
            if (i !== this._curIndex) {
                const delta = (i - this._curIndex) * this.coverWidth;
                let diff = (1 - (Math.abs(delta) + 2) * 0.1);
                if (diff < 0.1) {
                    diff = 0.1;
                }
                const sign = Math.sign(delta);
                let posX = delta * diff;
                let angle = -60 * sign;
                pos.set(posX, 0, 0);
                Quat.fromAxisAngle(rot, Vec3.UNIT_Y, angle/180 * Math.PI)
            }

            if (immediate) {       
                coverNode.setWorldPosition(pos);
                coverNode.setWorldRotation(rot);
            } else {
                tween(coverNode)
                .to(0.5, {position: pos, rotation: rot}, {onComplete: ()=> {
    
                }})
                .start();
            }

        }
    }

    moveRight() {
        if (this._curIndex + 1 < this._coverList.length) {
            this.tweenToIndex(this._curIndex + 1);
        }
    }

    moveLeft() {
        if (this._curIndex - 1 >= 0) {
            this.tweenToIndex(this._curIndex - 1);
        }
    }

    onClickPos(mousePos: Vec2) {
        const outRay = new Ray();
        this.mainCamera.screenPointToRay(mousePos.x, mousePos.y, outRay);
        PhysicsSystem.instance.raycastClosest(outRay);
        if (PhysicsSystem.instance.raycastClosestResult.collider &&
            PhysicsSystem.instance.raycastClosestResult.collider.node) {
            const node = PhysicsSystem.instance.raycastClosestResult.collider.node;
            const index = Number.parseInt(node.name);
    
            if (index < this._coverData.length) {
                if (this._isLoading) {
                    return;
                }

                this._isLoading = true;
                const sceneUrl = this._coverData[index].sceneUrl;
                if (director.loadScene(sceneUrl)) {
                    const persistCanvas = find('PersistCanvas')
                    persistCanvas.active = true;
                    this._isLoading = false;
                } else {
                    this._isLoading = false;
                }
            }
        }
    }

    onMouseUp(event: EventMouse) {
        this.onClickPos(event.getLocation());
    }

    onTouchEnd(touch: Touch, event: EventTouch) {
        this.onClickPos(event.getLocation());
    }

    onDestroy() {
        //鼠标监听
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);

        //触摸监听
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
