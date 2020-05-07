import { _decorator, Component, Node, LabelComponent, director } from "cc";
import { sceneArray } from "./scenelist";
import { BackButton } from "./backbutton";
const { ccclass, property, menu } = _decorator;

@ccclass("TEST-LIST.ListItem")
@menu("misc/test-list/ListItem")
export class ListItem extends Component {

    index = -1;
    _name = "";
    label : LabelComponent | null = null;

    onload () {

    }

    start () {
        // Your initialization goes here.
        this.index = this.node.getSiblingIndex();
        this._name = "";
        if(this.node){
            this.label = this.node.getComponentInChildren(LabelComponent) as LabelComponent;
        }
        this.updateItem(this.index,sceneArray[this.index]);
    }

    public loadScene() {
        BackButton.saveOffset();
        BackButton.saveIndex(this.index);
        director.loadScene(this._name);
    }

    public updateItem(idx: number, name: string) {
        this.index = idx;
        this._name = name;
        this.label.string = name;
    }
}
