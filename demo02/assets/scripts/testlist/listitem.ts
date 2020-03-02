import { _decorator, Component, Node, LabelComponent, director, ButtonComponent } from "cc";
import { sceneArray } from "./scenelist";
import { backbutton } from "./backbutton";
const { ccclass, property } = _decorator;

@ccclass("ListItem")
export class ListItem extends Component {

    index = -1;
    _name = "";
    label : LabelComponent | null = null;
    button : ButtonComponent | null = null;

    onload () {

    }

    start () {
        // Your initialization goes here.
        this.index = this.node.getSiblingIndex();
        this._name = "";
        if(this.node){
            this.label = this.node.getComponentInChildren(LabelComponent) as LabelComponent;
            this.button = this.node.getComponent(ButtonComponent) as ButtonComponent;
        }
        this.updateItem(this.index,sceneArray[this.index]);
    }

    public loadScene() {
        backbutton.saveOffset();
        backbutton.saveIndex(this.index);
        this.button.interactable = false;
        director.loadScene(this._name,backbutton.refreshButton);
    }

    public updateItem(idx: number, name: string) {
        this.index = idx;
        this._name = name;
        this.label.string = name;
    }
}
