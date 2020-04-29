import { _decorator, Component, LabelComponent } from "cc";
const { menu, ccclass, property } = _decorator;

@ccclass("LoopCall")
@menu("physics/LoopCall")
export class LoopCall extends Component {

    private _hander: number = 0;

    public onEnable () {
        // Your initialization goes here.
        this._hander = setInterval(this.clearString.bind(this), 3000);
    }

    public onDisable () {
        clearInterval(this._hander);
    }

    /**
     * clearString
     */
    public clearString () {
        const lable = this.getComponent(LabelComponent);
        if (lable) {
            lable.string = '-------------FLUSH------------ ';
        }
    }
}
