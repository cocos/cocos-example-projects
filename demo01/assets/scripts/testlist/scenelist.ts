import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

export const sceneArray:string[] = CC_WECHATGAME ?
[
    "helmet",
    "jellyfish",
    "knight",
    "particle-compare",
    "tangents",
    "winter",
] : [
    "helmet",
    "jellyfish",
    "knight",
    "particle-compare",
    "sponza",
    "tangents",
    "winter",
]

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
