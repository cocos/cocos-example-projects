import { _decorator, Component, Prefab, PhysicsSystem, ColliderComponent, math, ToggleComponent, BoxColliderComponent, Node, Vec3 } from "cc";
import { PrefabPoolUtil } from "../../../../common/scripts/PrefabPoolUtil";
import { EShapeAlgorithm, random_algorithm, x_square_2_algorithm, spiral_algorithm } from "./EShapeAlgorithm";
import { EGroup } from "./EGroupMask";
const { ccclass, property } = _decorator;

@ccclass("SIMPLE-HOLE.Instantiate")
export class Instantiate extends Component {

    @property({ type: EShapeAlgorithm })
    public algorithms = EShapeAlgorithm.RANDOM;

    @property({ type: Prefab })
    public boxPrefab: Prefab = null;

    @property({ type: Prefab })
    public spherePrefab: Prefab = null;

    @property
    public boxAmount: number = 50;

    @property
    public sphereAmount: number = 50;

    @property
    public gravity: math.Vec3 = new math.Vec3(0, -200, 0);

    onLoad () {
        // Your initialization goes here.
        PhysicsSystem.instance.gravity = this.gravity;
        this.spawnEntity();
    }

    onDestroy () {
        PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
        PrefabPoolUtil.clear();
    }

    spawnEntity () {
        for (let i = this.boxAmount; i--;) {
            let boxNode = PrefabPoolUtil.getItemByPoolName('SIMPLE-HOLE.box', this.boxPrefab);
            this.node.addChild(boxNode);
            boxNode.name = 'Body';
            let collider = boxNode.getComponent(ColliderComponent);
            if (collider) {
                collider.setGroup(EGroup.G_BODY);
                collider.setMask(-1);
            }
        }

        for (let i = this.sphereAmount; i--;) {
            let sphereNode = PrefabPoolUtil.getItemByPoolName('SIMPLE-HOLE.sphere', this.spherePrefab);
            this.node.addChild(sphereNode);
            sphereNode.name = 'Body';
            let collider = sphereNode.getComponent(ColliderComponent);
            if (collider) {
                collider.setGroup(EGroup.G_BODY);
                collider.setMask(-1);
            }
        }

        switch (this.algorithms) {
            case EShapeAlgorithm.RANDOM:
                for (let i = 0; i < this.node.children.length; i++) {
                    this.node.children[i].position = random_algorithm(-45, 45);
                }
                break;

            case EShapeAlgorithm.X_SQUARE_2:
                for (let i = 0; i < this.node.children.length; i++) {
                    this.node.children[i].position = x_square_2_algorithm(i, this.node.children.length);
                }
                break;

            case EShapeAlgorithm.SPIRAL:
                for (let i = 0; i < this.node.children.length; i++) {
                    this.node.children[i].position = spiral_algorithm(i, this.node.children.length);
                }
                break;
        }


        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = true;
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
