import { _decorator, Component, Node, LabelComponent, Quat, systemEvent, ColliderComponent, ITriggerEvent } from "cc";
import { InstanceMgr } from "./InstanceMgr";
const { ccclass, property } = _decorator;

@ccclass("BonusMgr")
export class BonusMgr extends Component {

    @property({ type: LabelComponent })
    scoreLb: LabelComponent = null;

    @property({ type: Node })
    mapNode: Node = null;

    allBonus: Node[] = [];

    score: number = 0;

    onLoad () {
        InstanceMgr.registerInstance('BonusMgr', this);
        systemEvent.on('onMapLoaded' as any, this.onMapLoaded, this);
    }

    start () {
        const allColliders = InstanceMgr.MotorCom.getComponents(ColliderComponent);
        for (let i = 0; i < allColliders.length; i++) {
            allColliders[i].on('onTriggerEnter', this.onTriggerEnterBonus, this);
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

    onMapLoaded () {
        for (let i = 0; i < this.mapNode.children.length; i++) {
            const n = this.mapNode.children[i];
            if (n.name == "Bonus-Cocos") {
                this.allBonus.push(n);
            }
        }
    }

    onTriggerEnterBonus (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Bonus-Cocos') {
            const i = this.allBonus.indexOf(event.otherCollider.node as Node);
            if (i >= 0) {
                this.allBonus.splice(i, 1);
                this.score++;
                this.scoreLb.string = this.score.toString();
                event.otherCollider.node.active = false;
            }
        }
    }

}

const _quat = Quat.fromEuler(new Quat(), 0, 3, 0);
