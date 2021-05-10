import { _decorator, Component, Prefab, PhysicsSystem, ColliderComponent, math, ToggleComponent, BoxColliderComponent, Node, Vec3, director, Director, Quat } from "cc";
import { PrefabPoolUtil } from "../../../../common/scripts/PrefabPoolUtil";
import { EShapeAlgorithm, random_algorithm, x_square_2_algorithm, spiral_algorithm } from "./EShapeAlgorithm";
import { EGroup } from "./EGroupMask";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-HOLE.Instantiate")
@menu("demo/simple-hole/Instantiate")
export class Instantiate extends Component {

    @property({ type: EShapeAlgorithm })
    public algorithms = EShapeAlgorithm.RANDOM;

    @property({ type: Prefab })
    public boxPrefab: Prefab = null as any;

    @property({ type: Prefab })
    public spherePrefab: Prefab = null as any;

    @property
    public boxAmount: number = 50;

    @property
    public sphereAmount: number = 50;

    @property
    public gravity: math.Vec3 = new math.Vec3(0, -10, 0);

    start () {
        // Your initialization goes here.
        PhysicsSystem.instance.gravity = this.gravity;
        this.spawnEntity();
        director.once(Director.EVENT_BEFORE_PHYSICS, () => {
            PhysicsSystem.instance.resetAccumulator()
        })
    }

    onDestroy () {
        PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
        PrefabPoolUtil.clear('SIMPLE-HOLE.box');
        PrefabPoolUtil.clear('SIMPLE-HOLE.sphere');
    }

    spawnEntity () {
        let nodes: Node[] = [];
        for (let i = this.boxAmount; i--;) {
            let n = PrefabPoolUtil.getItemByPoolName('SIMPLE-HOLE.box', this.boxPrefab);
            n.name = 'Body';
            nodes.push(n);
        }

        for (let i = this.sphereAmount; i--;) {
            let n = PrefabPoolUtil.getItemByPoolName('SIMPLE-HOLE.sphere', this.spherePrefab);
            n.name = 'Body';
            nodes.push(n);
        }

        switch (this.algorithms) {
            case EShapeAlgorithm.RANDOM:
                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].worldPosition = random_algorithm(-17, 17);
                }
                break;

            case EShapeAlgorithm.X_SQUARE_2:
                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].worldPosition = x_square_2_algorithm(i, nodes.length);
                }
                break;

            case EShapeAlgorithm.SPIRAL:
                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].worldPosition = spiral_algorithm(i, nodes.length);
                }
                break;
        }

        /**
         * 先设置 Transform 再添加到节点树中，避免一些 BUG
         */
        for (let i = 0; i < nodes.length; i++) {
            let n = nodes[i];
            n.worldRotation = Quat.IDENTITY;
            n.active = true;
            this.node.addChild(n);
            let collider = n.getComponent(ColliderComponent);
            if (collider) {
                collider.setGroup(EGroup.G_BODY);
                collider.setMask(-1);
            }
        }
    }

    recoverEntity () {
        for (let i = this.node.children.length; i--;) {
            let entity = this.node.children[i];
            entity.removeFromParent();
            // hack
            if (entity.getComponent(BoxColliderComponent) !== null) {
                PrefabPoolUtil.recoverItemByPoolName('SIMPLE-HOLE.box', entity);
            } else {
                PrefabPoolUtil.recoverItemByPoolName('SIMPLE-HOLE.sphere', entity);
            }
        }
    }

    toggleAlgorithms (toggle: ToggleComponent, value: EShapeAlgorithm) {
        this.algorithms = Number(value);

        // recover
        this.recoverEntity();

        // respawn
        this.spawnEntity();
    }

}
