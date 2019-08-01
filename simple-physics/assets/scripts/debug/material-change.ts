import { _decorator, Component, Material, ModelComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("material-change")
export class materialchange extends Component {

    @property({ type: Material })
    public mpDebug: Material = null;

    @property({ type: Material })
    public mhDebug: Material = null;

    @property({ type: Material })
    public mp: Material = null;

    @property({ type: Material })
    public mh: Material = null;

    @property({ type: ModelComponent })
    public mpModel: ModelComponent = null;

    @property({ type: ModelComponent })
    public mhModel: ModelComponent = null;

    start () {
        this.enabled = false;
    }

    public enable () {
        this.enabled = !this.enabled;
        if (this.mpModel) {
            this.mpModel.material = this.enabled ? this.mpDebug : this.mp;
        }
        if (this.mhModel) {
            this.mhModel.material = this.enabled ? this.mhDebug : this.mh;
        }
    }

}
