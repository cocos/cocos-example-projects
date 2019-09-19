import { _decorator, Component, Node, ColliderComponent, ICollisionEvent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("colliderdisabled")
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
