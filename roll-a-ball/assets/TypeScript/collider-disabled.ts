import { _decorator, Component, Node, ColliderComponent, ICollisionEvent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("colliderdisabled")
export class colliderdisabled extends Component {
    public start () {
        let Collider = this.getComponent(ColliderComponent);
        Collider.on('onCollisionStay', this.onCollision, this);
    }
    
    private onCollision (event: ICollisionEvent) {
        console.log(event.type, event);
        if(event.otherCollider.node.name!="Ground"&&event.otherCollider.node.parent.name!="Ground"&&event.otherCollider.node.parent.parent.name!="Ground")
        {event.otherCollider.node.active=false;}
    }
}
