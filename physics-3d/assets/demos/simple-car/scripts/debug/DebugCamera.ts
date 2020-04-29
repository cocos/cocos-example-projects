import { _decorator, Component, Node, CameraComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DebugCamera")
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
