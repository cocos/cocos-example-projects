import { _decorator, Component, Prefab, instantiate } from 'cc';
import { JellyFish } from './jellyfish';
const { ccclass, property } = _decorator;

@ccclass('Spawn')
export class Spawn extends Component {

    @property(Prefab)
    public prefab = null;

    @property
    public count = 30;

    @property
    public range = 30;

    public start () {
        for (let i = 0; i < this.count; ++i) {
            setTimeout(() => {
                if (!this.prefab) { return; }
                const node = instantiate(this.prefab);
                node.getComponent(JellyFish).range = this.range;
                this.node.addChild(node);
            }, Math.random() * 3000);
        }
    }
}
