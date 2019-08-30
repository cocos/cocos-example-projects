// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, ButtonComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("scenechange")
export class SceneChange extends Component {
    @property
    nextSceneName = "";

    @property
    preSceneName = "";

    onLoad () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "scenechange";
        clickEventHandler.handler = "nextscene";
        clickEventHandler.handler = "prescene";

        var button = this.node.getComponent(ButtonComponent);
        button.interactable = true;
        button.clickEvents.push(this.clickEventHandler);
    }

    nextscene(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(ButtonComponent);
        button.interactable = false;
        console.log("111");
        cc.director.loadScene(this.nextSceneName);
    }

    prescene(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(ButtonComponent);
        button.interactable = false;
        console.log("222");
        cc.director.loadScene(this.preSceneName);
    }

}
