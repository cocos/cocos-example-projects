import { _decorator, Component, Node, game, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopBar')
export class TopBar extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        game.addPersistRootNode(this.node);
    }

    onHomeButtonClicked() {
        director.loadScene('lobby');
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
