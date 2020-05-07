import { _decorator, Component, Node, CameraComponent } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-CAR.DebugCamera")
@menu("demo/simple-car/DebugCamera")
export class DebugCamera extends Component {

    @property({ type: CameraComponent })
    mainCamera: CameraComponent = null;

    onEnable () {
        this.mainCamera.enabled = false;
    }

    onDisable () {
        this.mainCamera.enabled = true;
    }
}
