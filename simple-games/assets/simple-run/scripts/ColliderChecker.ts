import { _decorator, Component, Node, ColliderComponent, ITriggerEvent } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('ColliderChecker')
export class ColliderChecker extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: PlayerController})
    public playerCtrl: PlayerController = null;

    start () {
        // collider
        const collider = this.getComponent(ColliderComponent);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        if (this.playerCtrl) {
            this.playerCtrl.onTriggerEnter(event);
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
