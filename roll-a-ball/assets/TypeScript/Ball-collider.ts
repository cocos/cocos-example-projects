import { _decorator, Component, Node, SphereColliderComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Ballbody")
export class Ballbody extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {

            this.getComponent(SphereColliderComponent);

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
