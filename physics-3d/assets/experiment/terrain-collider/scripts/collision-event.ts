import { _decorator, Component, Node, ColliderComponent, ICollisionEvent, ITriggerEvent, LabelComponent } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('TERRAIN-COLLIDER.CollisionEvent')
@menu('experiment/terrain-collider/CollisionEvent')
export class collisionEvent extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({ type: LabelComponent })
    label: LabelComponent = null;

    @property({ type: LabelComponent })
    label2: LabelComponent = null;

    start () {
        // Your initialization goes here.
        const collider = this.getComponent(ColliderComponent);
        collider.on('onCollisionEnter', this.onCollision, this);
        collider.on('onCollisionStay', this.onCollision, this);
        collider.on('onCollisionExit', this.onCollision, this);
        collider.on('onTriggerEnter', this.onTrigger, this);
        collider.on('onTriggerStay', this.onTrigger, this);
        collider.on('onTriggerExit', this.onTrigger, this);
    }

    onCollision (event: ICollisionEvent) {
        console.log(event.type, event.otherCollider.name, event.selfCollider.name);
        this.label.string = event.type + ' ' + event.otherCollider.name + ' ' + event.selfCollider.name;
    }

    onTrigger (event: ITriggerEvent) {
        console.log(event.type, event.otherCollider.name, event.selfCollider.name);
        this.label2.string = event.type + ' ' + event.otherCollider.name + ' ' + event.selfCollider.name;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
