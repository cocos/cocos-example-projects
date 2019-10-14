import { _decorator, Component, Node, ScrollViewComponent, Vec3, ButtonComponent } from "cc";
const { ccclass, property } = _decorator;
import { sceneArray } from "./scenelist";

@ccclass("backbutton")
export class backbutton extends Component {
    private static _offset = new Vec3();
    public static _scrollNode : Node | null  = null;
    private static _scrollCom : ScrollViewComponent | null = null;

    private static _sceneIndex : number = -1;
    private static _prevNode : Node;
    private static _nextNode : Node;
    private static _prevButton : ButtonComponent;
    private static _nextButton : ButtonComponent;

    public static get offset() {
        return backbutton._offset;
    }

    public static set offset( value ) {
        backbutton._offset = value;
    }

    public static saveOffset () {
        if ( backbutton._scrollNode ) {
            backbutton._offset = new Vec3(0, backbutton._scrollCom.getScrollOffset().y, 0);
        }
    }

    public static saveIndex ( index : number) {
        backbutton._sceneIndex = index;
        backbutton.refreshButton();
    }

    public static refreshButton () {
        if (backbutton._sceneIndex === -1) {
            backbutton._prevNode.active = false;
            backbutton._nextNode.active = false;
        } else {
            backbutton._prevNode.active = true;
            backbutton._nextNode.active = true;
        }
    }

    start () {
        cc.game.addPersistRootNode(this.node);
        backbutton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
        if (backbutton._scrollNode) {
            backbutton._scrollCom = backbutton._scrollNode.getComponent(ScrollViewComponent);
        }
        backbutton._prevNode = this.node.getChildByName('PrevButton') as Node;
        backbutton._nextNode = this.node.getChildByName('NextButton') as Node;
        if (backbutton._prevNode && backbutton._nextNode) {
            backbutton._prevButton = backbutton._prevNode.getComponent(ButtonComponent);
            backbutton._nextButton = backbutton._nextNode.getComponent(ButtonComponent);
            backbutton.refreshButton();
        }
    }

    backToList () {
        cc.director.loadScene('testlist');
        backbutton._sceneIndex = -1;
        backbutton.refreshButton();
        let self = this;
        setTimeout(function(){
            backbutton._scrollNode = self.node.getParent().getChildByPath('Canvas/ScrollView') as Node;
            if (backbutton._scrollNode) {
                backbutton._scrollCom = backbutton._scrollNode.getComponent(ScrollViewComponent);
                backbutton._scrollCom.scrollToOffset(backbutton.offset,0.1,true);
            }
        },100);
    }

    nextscene () {
        backbutton._nextButton.interactable = false;
        this.updateSceneIndex(true);
        cc.director.loadScene(this.getSceneName());
        this.scheduleOnce(function(){
            backbutton._nextButton.interactable = true;
        },0.5);
    }

    prescene () {
        backbutton._prevButton.interactable = false;
        this.updateSceneIndex(false);
        cc.director.loadScene(this.getSceneName());
        this.scheduleOnce(function(){
            backbutton._prevButton.interactable = true;
        },0.5);
    }

    updateSceneIndex(next:Boolean) {
        if (next) {
            (backbutton._sceneIndex + 1) >= sceneArray.length ? backbutton._sceneIndex = 0 : backbutton._sceneIndex += 1;
        }else {
            (backbutton._sceneIndex - 1) < 0 ? backbutton._sceneIndex = sceneArray.length - 1 : backbutton._sceneIndex -= 1;
        }
    }

    getSceneName () {
        return sceneArray[backbutton._sceneIndex];
    }
}
