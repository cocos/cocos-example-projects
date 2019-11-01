import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

export const sceneArray:string[] = []

@ccclass("scenemanager")
export class SceneManager extends Component {

    @property ({ type: Prefab })
    itemPrefab: Prefab | null  = null;

    onLoad() {
        if(this.itemPrefab){
            for(let i = 0; i<sceneArray.length; i++ ) {
                let item = cc.instantiate(this.itemPrefab);
                this.node.addChild(item);
            }
        }
    }

    start () {
    }
}
