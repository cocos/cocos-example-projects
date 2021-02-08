
import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { math } from 'cc';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3();

@ccclass('ColliderManager')
export class ColliderManager extends Component {

    @property
    public count = 200;

    @property
    public boundHalfLength = 12.5;

    @property([Node])
    public prefabs = [];

    @property({type: Node})
    public tipsNode = null;

    public start () {
        this.tipsNode.active = window.CC_PHYSICS_BUILTIN;

        this.node.removeAllChildren();
        for (let i = 0; i < this.count; i++) {
            const node = instantiate(this.prefabs[Math.round(Math.random())]);
            node.parent = this.node;
            node.setPosition(math.randomRange(-2, 2), 3 + i * 2, math.randomRange(-2, 2));
            node.setRotationFromEuler(math.randomRange(0, 180), math.randomRange(0, 180), math.randomRange(0, 180));
        }
    }

    public update () {
        // handle bounds
        for (const node of this.node.children) {
            node.getPosition(v3_1);
            if      (v3_1.y <                       -10) { v3_1.y =  30; }
            else if (v3_1.x >  (this.boundHalfLength + 3)) { v3_1.x = -(this.boundHalfLength - 3); }
            else if (v3_1.x < -(this.boundHalfLength + 3)) { v3_1.x =  (this.boundHalfLength - 3); }
            else if (v3_1.z >  (this.boundHalfLength + 3)) { v3_1.z = -(this.boundHalfLength - 3); }
            else if (v3_1.z < -(this.boundHalfLength + 3)) { v3_1.z =  (this.boundHalfLength - 3); }
            node.setPosition(v3_1);
        }
    }
}
