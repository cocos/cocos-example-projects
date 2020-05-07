import { _decorator, Component, Node, Prefab, instantiate } from "cc";
const { ccclass, property, menu } = _decorator;

export const sceneArray: string[] = [];

@ccclass("TEST-LIST.SceneManager")
@menu("misc/test-list/SceneManager")
export class SceneManager extends Component {

    @property({ type: Prefab })
    itemPrefab: Prefab | null = null;

    onLoad () {
        if (this.itemPrefab) {
            for (let i = 0; i < sceneArray.length; i++) {
                let item = instantiate(this.itemPrefab);
                this.node.addChild(item);
            }
        }
    }

    start () {
    }
}
