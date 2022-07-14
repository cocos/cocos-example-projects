import { _decorator, Component, director, game, Node, ScrollView, Vec3, Layout, Canvas, Layers } from 'cc';
const { ccclass, property } = _decorator;
import { sceneArray } from './scenelist';

@ccclass('BackButton')
export class BackButton extends Component {

    public static get offset () {
        return BackButton._offset;
    }

    public static set offset ( value ) {
        BackButton._offset = value;
    }
    public static _scrollNode: Node | null  = null;

    public static saveOffset () {
        if ( BackButton._scrollNode ) {
            BackButton._offset = new Vec3(0, BackButton._scrollCom.getScrollOffset().y, 0);
        }
    }

    public static saveIndex ( index: number) {
        BackButton._sceneIndex = index;
        BackButton.refreshButton();
    }

    public static refreshButton () {
        if (BackButton._sceneIndex === -1) {
            BackButton._prevNode.active = false;
            BackButton._nextNode.active = false;
        } else {
            BackButton._prevNode.active = true;
            BackButton._nextNode.active = true;
        }
    }
    private static _offset = new Vec3();
    private static _scrollCom: ScrollView | null = null;

    private static _sceneIndex: number = -1;
    private static _blockInput : Node;
    private static _prevNode: Node;
    private static _nextNode: Node;

    public __preload () {
        const sceneInfo = game._sceneInfos;
        let firstIndex = 0;
        let lastIndex = 0;
        let sceneString: string = '';
        for (let i = 0; i < sceneInfo.length; i++){
            sceneString = sceneInfo[i].url;
            firstIndex = sceneString.lastIndexOf('/') + 1;
            lastIndex = sceneString.lastIndexOf('.scene');
            sceneString = sceneString.substring(firstIndex, lastIndex);
            if (sceneString === 'testlist') {
                continue;
            }
            sceneArray.push(sceneString);
        }
    }

    public start () {
        let camera = this.node.getComponent(Canvas)!.cameraComponent!;
        if (camera.visibility & Layers.Enum.UI_2D) camera.visibility &= ~Layers.Enum.UI_2D;
        game.addPersistRootNode(this.node);
        BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
        if (BackButton._scrollNode) {
            BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);
        }
        BackButton._blockInput = this.node.getChildByName('BlockInput') as Node;
        BackButton._blockInput.active = false;
        BackButton._prevNode = this.node.getChildByName('PrevButton') as Node;
        BackButton._nextNode = this.node.getChildByName('NextButton') as Node;
        if (BackButton._prevNode && BackButton._nextNode) {
            BackButton.refreshButton();
        }
    }

    public backToList () {
        BackButton._blockInput.active = true;
        director.loadScene('testlist', () => {
            BackButton._sceneIndex = -1;
            BackButton.refreshButton();
            BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
            if (BackButton._scrollNode) {
                BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);
                // @ts-ignore
                BackButton._scrollCom._content.getComponent(Layout).updateLayout();
                BackButton._scrollCom.scrollToOffset(BackButton.offset, 0.1, true);
            }
            BackButton._blockInput.active = false;
        });
    }

    public nextscene () {
        BackButton._blockInput.active = true;
        this.updateSceneIndex(true);
        director.loadScene(this.getSceneName(), () => {
            BackButton._blockInput.active = false;
        });
    }

    public prescene () {
        BackButton._blockInput.active = true;
        this.updateSceneIndex(false);
        director.loadScene(this.getSceneName(), () => {
            BackButton._blockInput.active = false;
        });
    }

    public updateSceneIndex (next: Boolean) {
        if (next) {
            (BackButton._sceneIndex + 1) >= sceneArray.length ? BackButton._sceneIndex = 0 : BackButton._sceneIndex += 1;
        }else {
            (BackButton._sceneIndex - 1) < 0 ? BackButton._sceneIndex = sceneArray.length - 1 : BackButton._sceneIndex -= 1;
        }
    }

    public getSceneName () {
        return sceneArray[BackButton._sceneIndex];
    }
}
