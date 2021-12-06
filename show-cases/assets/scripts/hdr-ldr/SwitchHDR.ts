
import { _decorator, Component, Button, labelAssembler, game ,director,Node, Scene, renderer,CameraComponent} from 'cc';
import { TangentVisualizer } from '../tangent-visualizer';
//import { _decorator, Component, Node, Scene, renderer, SliderComponent, CameraComponent, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SwitchHDR
 * DateTime = Mon Dec 06 2021 14:32:13 GMT+0800 (GMT+08:00)
 * Author = xu58895777
 * FileBasename = SwitchHDR.ts
 * FileBasenameNoExtension = SwitchHDR
 * URL = db://assets/scripts/hdr-ldr/SwitchHDR.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('SwitchHDR')
export class SwitchHDR extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Button)
    button: Button | null = null;
    isHDR = true;

    //private _ambient: renderer.scene.Ambient = null!;
    //private _camera: renderer.scene.Camera = null!;
    private _skyBox : renderer.scene.Skybox=null!; 
    start ()
    {
        const scene = this.node.scene as Scene;
        const pipeline = director.root!.pipeline;
        //this._ambient = pipeline.pipelineSceneData.ambient;
        //this._camera = scene.getComponentInChildren(CameraComponent)!.camera;
        this._skyBox = pipeline.pipelineSceneData.skybox;
    }

    onLoad () {
        if (this.button!=null)
            this.button.node.on(Button.EventType.CLICK, this.callback, this);
    }

    callback (button: Button)
    {
        if(this.isHDR==true)
        {
            this.isHDR=false;
            this._skyBox.useHDR=false;
        }
        else
        {
            this.isHDR=true;
            this._skyBox.useHDR=true;
        }

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
