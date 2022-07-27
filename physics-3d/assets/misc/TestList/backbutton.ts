import { _decorator, Component, Node, ScrollView, Vec3, Button, Layout, game, LabelComponent, director, Director, Canvas, Layers } from "cc";
const { ccclass, property, menu } = _decorator;
import { sceneArray } from "./scenelist";

@ccclass("TEST-LIST.BackButton")
@menu("misc/test-list/BackButton")
export class BackButton extends Component {
    private static _offset = new Vec3();
    public static _scrollNode: Node | null = null;
    private static _scrollCom: ScrollView | null = null;

    private static _sceneIndex: number = -1;
    private static _prevNode: Node;
    private static _nextNode: Node;
    private static _prevButton: Button;
    private static _nextButton: Button;
    private sceneName: LabelComponent;

    __preload () {
        const sceneInfo = game._sceneInfos;
        const array: string[] = sceneInfo.map((i) => i.url).sort();
        for (let i = 0; i < array.length; i++) {
            let str = array[i];
            if (str.includes("TestList") || str.includes("subPack") || str.includes('editor-only') || str.includes('experiment')) {
                continue;
            }
            const firstIndex = str.lastIndexOf('/') + 1;
            const lastIndex = str.lastIndexOf('.scene');
            sceneArray.push(str.substring(firstIndex, lastIndex));
        }
    }

    public static get offset () {
        return BackButton._offset;
    }

    public static set offset (value) {
        BackButton._offset = value;
    }

    public static saveOffset () {
        if (BackButton._scrollNode) {
            BackButton._offset = new Vec3(0, BackButton._scrollCom.getScrollOffset().y, 0);
        }
    }

    public static saveIndex (index: number) {
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

    start () {
        let camera = this.node.getComponent(Canvas)!.cameraComponent!;
        if (camera.visibility & Layers.Enum.UI_2D) camera.visibility &= ~Layers.Enum.UI_2D;
        this.sceneName = director.getScene().getChildByName("backRoot").getChildByName("sceneName").getComponent(LabelComponent);
        game.addPersistRootNode(this.node);
        BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
        if (BackButton._scrollNode) {
            BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);
        }
        BackButton._prevNode = this.node.getChildByName('PrevButton') as Node;
        BackButton._nextNode = this.node.getChildByName('NextButton') as Node;
        if (BackButton._prevNode && BackButton._nextNode) {
            BackButton._prevButton = BackButton._prevNode.getComponent(Button);
            BackButton._nextButton = BackButton._nextNode.getComponent(Button);
            BackButton.refreshButton();
        }
        director.on(Director.EVENT_BEFORE_SCENE_LOADING, this.switchSceneName, this);
    }

    switchSceneName () {
        if (this.getSceneName() == null) {
            return;
        }
        this.sceneName.node.active = true;
        this.sceneName.string = this.getSceneName();
    }

    backToList () {
        if (game.isPaused()) {
            game.resume();
        }
        director.loadScene("TestList", function () {
            this.sceneName.node.active = false;
            BackButton._sceneIndex = -1;
            BackButton.refreshButton();
            BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
            if (BackButton._scrollNode) {
                BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);
                BackButton._scrollCom._content.getComponent(Layout).updateLayout();
                BackButton._scrollCom.scrollToOffset(BackButton.offset, 0.1, true);
            }
        }.bind(this));
    }

    nextScene () {
        if (game.isPaused()) {
            game.resume();
        }
        BackButton._nextButton.interactable = false;
        this.updateSceneIndex(true);
        director.loadScene(this.getSceneName(), function () {
            BackButton._nextButton.interactable = true;
        });
    }

    preScene () {
        if (game.isPaused()) {
            game.resume();
        }
        BackButton._prevButton.interactable = false;
        this.updateSceneIndex(false);
        director.loadScene(this.getSceneName(), function () {
            BackButton._prevButton.interactable = true;
        });
    }

    updateSceneIndex (next: Boolean) {
        if (next) {
            (BackButton._sceneIndex + 1) >= sceneArray.length ? BackButton._sceneIndex = 0 : BackButton._sceneIndex += 1;
        } else {
            (BackButton._sceneIndex - 1) < 0 ? BackButton._sceneIndex = sceneArray.length - 1 : BackButton._sceneIndex -= 1;
        }
    }

    getSceneName () {
        return sceneArray[BackButton._sceneIndex];
    }
}
