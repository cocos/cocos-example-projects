
import { _decorator, Component, Node } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('BUOYANCY.WaterFX')
@menu("demo/buoyancy/WaterFX")
export class WaterFX extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
