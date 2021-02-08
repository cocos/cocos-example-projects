import { _decorator, Component, Node, ColliderComponent, ICollisionEvent } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("RALL-A-BALL.colliderdisabled")
@menu("demo/roll-a-ball/colliderdisabled")
export class colliderdisabled extends Component {
    public start () {
        let Collider = this.getComponent(ColliderComponent);
        Collider.on('onTriggerEnter', this.onTrigger, this);
    }

    private onTrigger (event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Bonus") {
            event.otherCollider.node.active = false;
        }
    }
}
