import { _decorator, Component, Prefab } from "cc";
import { JellyFish } from './jellyfish';
const { ccclass, property } = _decorator;

@ccclass("Spawn")
export class Spawn extends Component {

    @property(Prefab)
    prefab = null;

    @property
    count = 30;

    @property
    range = 30;

    start () {
        for (let i = 0; i < this.count; ++i) {
            setTimeout(() => {
                if (!this.prefab) { return; }
                let node = cc.instantiate(this.prefab);
                node.getComponent(JellyFish).range = this.range;
                this.node.addChild(node);
            }, Math.random() * 3000);
        }
    }
}
