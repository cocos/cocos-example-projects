import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    private _collider: ColliderComponent = null;
    private _rigidBody: RigidBodyComponent = null;
    private _flyTime: number = 0;
    private _autoDestoryTime: number = 5;

    onLoad () {
        // Your initialization goes here.
        this._collider = this.node.getComponent(ColliderComponent);
        this._rigidBody = this.node.getComponent(RigidBodyComponent);

        this._collider.on('onCollisionEnter', this.onCollisionEnter, this)
    }

    init(velocity: Vec3) {
        this._rigidBody.setLinearVelocity(velocity);
    }

    onCollisionEnter(event) {
        // if(event.otherCollider.node.name == 'AirWell'||
        //    event.otherCollider.node.name == 'Monster'||
        //    event.otherCollider.node.name == 'tree'){
        //     this.node.destroy();
        // }
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this._flyTime += deltaTime;
        if (this._flyTime >= this._autoDestoryTime) {
            this.node.destroy();
        }
    }
}
