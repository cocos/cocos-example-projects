import { _decorator, Component, Node, Prefab, math, instantiate, Quat, Vec3 } from "cc";
const { ccclass, property } = _decorator;

const _v3_0 = new Vec3();
const _quat_0 = new Quat();

@ccclass("Instantiate")
export class Instantiate extends Component {
    @property({ type: Prefab })
    public boxPrefab: Prefab = null;

    @property
    public boxAmount: number = 30;

    start () {
        _v3_0.y = 1;
        const radianPart = 2 * Math.PI / this.boxAmount;
        for (let i = this.boxAmount; i--;) {
            const boxNode = instantiate(this.boxPrefab) as Node;
            boxNode.setParent(this.node as Node);
            boxNode.active = true;

            let rad = radianPart * i;
            _v3_0.x = 4 * Math.cos(rad);
            _v3_0.z = 8 * Math.sin(rad);

            boxNode.setWorldPosition(_v3_0);
        }
        const boxNode1 = instantiate(this.boxPrefab) as Node;
        boxNode1.setParent(this.node as Node);
        boxNode1.setWorldPosition(-6, 2.5, 0);

        const boxNode2 = instantiate(this.boxPrefab) as Node;
        boxNode2.setParent(this.node as Node);
        boxNode2.setWorldPosition(6, 2.5, 0);
    }

    update (deltaTime: number) {
        if (this.node.children.length > 0) {
            _v3_0.set(-1, 1, 0);
            _v3_0.normalize();
            Quat.rotateAround(_quat_0, this.node.children[0].rotation, _v3_0, Math.PI * 0.01);

            for (let i = 0; i < this.node.children.length; i++) {
                this.node.children[i].setRotation(_quat_0);
            }
        }
    }

    reset () {
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = true;
        }
        this.node.parent.children[1].setWorldPosition(0, 4, 0);
    }

}



