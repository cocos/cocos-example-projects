import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent, PhysicsSystem, director, Scene, Prefab, instantiate } from 'cc';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('Grenade')
export class Grenade extends Component {
    @property({type: Prefab})
    public explosionPrfb: Prefab = null;
    
    private _collider: ColliderComponent = null;
    private _rigidBody: RigidBodyComponent = null;
    private _flyTime: number = 0;
    private _autoDestoryTime: number = 3;
    private _explosionForce = 100;
    private _explosionRadius = 10;

    onLoad () {
        // Your initialization goes here.
        this._collider = this.node.getComponent(ColliderComponent);
        this._rigidBody = this.node.getComponent(RigidBodyComponent);

        this._collider.on('onCollisionEnter', this.onCollisionEnter, this)
    }

    init(force: Vec3) {
        this._rigidBody.applyImpulse(force, new Vec3(0, -1, 0));
    }

    onCollisionEnter(event) {
        this.explosion();
    }

    explosion() {
        this.node.destroy();
        const scene: Scene = director.getScene();
        const explosion: any = instantiate(this.explosionPrfb);
        scene.addChild(explosion);
        explosion.setWorldPosition(this.node.getWorldPosition());

        const children: any[] = scene.children;
        children.forEach((node:Node) => {
            Utils.walkNode(node, (node: Node) => {
                const rigid = node.getComponent(RigidBodyComponent);
                if (rigid) {
                    const dir = new Vec3();
                    Vec3.subtract(dir, node.getWorldPosition(), this.node.getWorldPosition());
                    const dist: number = dir.length();
                    if (dist < this._explosionRadius) {
                        dir.normalize();
                        Vec3.multiplyScalar(dir, dir, this._explosionForce / dist);
                        rigid.applyImpulse(dir);
                    }
                }
            });
        })
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this._flyTime += deltaTime;
        if (this._flyTime >= this._autoDestoryTime) {
            this.explosion();
        }
    }
}
