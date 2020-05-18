import { _decorator, Component, Node, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoDestory')
export class AutoDestory extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property({type: CCFloat})
    public destroyTime: number = 1;
    
    private _curPassedTime: number = 0;

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this._curPassedTime += deltaTime;
        if (this._curPassedTime > this.destroyTime) {
            this.node.destroy();
        }
    }
}
