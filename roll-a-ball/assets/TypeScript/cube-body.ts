import { _decorator, Component, Node, ColliderComponent, ICollisionEvent, SphereColliderComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("cubebody")
export class cubebody extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    public start () {
        let Collider = this.getComponent(ColliderComponent);
        Collider.on('onCollisionEnter', this.onCollision, this);
    }
    
    private onCollision (event: ICollisionEvent) {
        console.log(event.type, event);
        if(event.otherCollider.name==="")
        {this.node.active=false;}
    }
}
