import { _decorator, Component, Node, LabelComponent, Quat, systemEvent } from "cc";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property } = _decorator;

@ccclass("BonusMgr")
export class BonusMgr extends Component {

    @property({ type: LabelComponent })
    scoreLb: LabelComponent = null;

    @property({ type: Node })
    mapNode: Node = null;

    allBonus: Node[] = [];

    onLoad () {
        InstanceMgr.registerInstance('BonusMgr', this);
        systemEvent.on('onMapLoaded', this.onMapLoaded, this);
    }

    onMapLoaded () {
        for (let i = 0; i < this.mapNode.children.length; i++) {
            const n = this.mapNode.children[i];
            if (n.name == "Bonus-Cocos") {
                this.allBonus.push(n);
            }
        }
    }

    update (deltaTime: number) {
        if (this.allBonus.length > 0) {
            this.allBonus[0].rotate(_quat);

            for (let i = 1; i < this.allBonus.length; i++) {
                const n = this.allBonus[i];
                n.setRotation(this.allBonus[0].rotation);
            }
        }
    }
}

const _quat = Quat.fromEuler(new Quat(), 0, 3, 0);
