import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

export const sceneArray: string[] = [];

@ccclass('SceneManager')
export class SceneManager extends Component {

    @property ({ type: Prefab })
    public itemPrefab: Prefab | null  = null;

    public onLoad () {
        if (this.itemPrefab){
            for (let i = 0; i < sceneArray.length; i++ ) {
                const item = instantiate(this.itemPrefab);
                this.node.addChild(item);
            }
        }
    }

    public start () {
    }
}
