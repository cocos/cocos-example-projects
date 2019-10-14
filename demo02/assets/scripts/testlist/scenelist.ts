import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

export const sceneArray:string[] = [
    "ambient",
    "audio",
    "blade-strom",
    "collision-detection",
    "custom-effect",
    "heal-spell",
    "particles",
    "pbr",
    "physics",
    "shadows",
    "skin",
    "toon",
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
