import { _decorator, Component, Node, ColliderComponent, ICollisionEvent } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("RALL-A-BALL.colliderdisabled")
@menu("demo/roll-a-ball/colliderdisabled")
export class colliderdisabled extends Component {
    public start () {
        let Collider = this.getComponent(ColliderComponent);
        Collider.on('onCollisionEnter', this.onCollision, this);
    }

    private onCollision (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Bonus") {
            event.otherCollider.node.active = false;
        }
    }
}
