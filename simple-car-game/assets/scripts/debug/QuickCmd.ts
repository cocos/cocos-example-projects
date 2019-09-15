import { _decorator, Component, EditBoxComponent } from "cc";
const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('QuickCmd')
@requireComponent(EditBoxComponent)
export class QuickCmd extends Component {

    @property({ type: EditBoxComponent })
    public editBox: EditBoxComponent = null;

    onLoad () {
        // this.editBox.
    }

    parseCmd (str: string) {
        let arr = str.split(':');
        if (arr) {
            if (arr.length > 1) {
                let cmd = arr[0];
                let value = arr[1];
                
            }
        }

    }

}