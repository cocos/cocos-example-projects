
import { _decorator, Component, Node, instantiate, Vec3 } from "cc";
const { ccclass, property } = _decorator;

const v3_1 = new Vec3();

@ccclass("ColliderManager")
export class ColliderManager extends Component {

    @property
    count = 200;

    @property
    boundHalfLength = 12.5;

    @property([Node])
    prefabs = [];

    start () {
        this.node.removeAllChildren();
        for (let i = 0; i < this.count; i++) {
            const node = instantiate(this.prefabs[Math.round(Math.random())]);
            node.parent = this.node;
            node.setPosition(cc.math.randomRange(-2, 2), 3 + i * 2, cc.math.randomRange(-2, 2));
            node.setRotationFromEuler(cc.math.randomRange(0, 180), cc.math.randomRange(0, 180), cc.math.randomRange(0, 180));
        }
    }

    update () {
        // handle bounds
        for (const node of this.node.children) {
            node.getPosition(v3_1);
            if      (v3_1.y <                       -10) v3_1.y =  30;
            else if (v3_1.x >  (this.boundHalfLength+3)) v3_1.x = -(this.boundHalfLength-3);
            else if (v3_1.x < -(this.boundHalfLength+3)) v3_1.x =  (this.boundHalfLength-3);
            else if (v3_1.z >  (this.boundHalfLength+3)) v3_1.z = -(this.boundHalfLength-3);
            else if (v3_1.z < -(this.boundHalfLength+3)) v3_1.z =  (this.boundHalfLength-3);
            node.setPosition(v3_1);
        }
    }
}
