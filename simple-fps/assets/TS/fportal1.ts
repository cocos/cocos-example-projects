import { _decorator, Component, Node, Prefab, director, instantiate, math } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("fportal1")
export class fportal1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    //场景1
    @property({type:Prefab})
    public Scene1Prefab: Prefab =null;

    //场景2
    @property({type:Prefab})
    public Scene2Prefab: Prefab =null;
    //场景Boss
    @property({type:Prefab})
    public SceneBoss1Prefab: Prefab =null;
    //决定跳哪个场景
    private _ChooseScene:number=0;

    private collider:any=null;

    //实例化场景1
    PrefabScene1Prefab(){
        var scene= director.getScene();
        var newScene1 = instantiate(this.Scene1Prefab);
        scene.addChild(newScene1);
        newScene1.setPosition(0,0,-50);
    }

    //实例化场景2
    PrefabScene2Prefab(){
        var scene= director.getScene();
        var newScene2 = instantiate(this.Scene2Prefab);
        scene.addChild(newScene2);
        newScene2.setPosition(0,0,-100);
    }

    //实例化场景Boss1
    PrefabSceneBoss1Prefab(){
        var scene= director.getScene();
        var newSceneBoss1 = instantiate(this.SceneBoss1Prefab);
        scene.addChild(newSceneBoss1);
        newSceneBoss1.setPosition(0,0,50);
    }


    start () {
        // Your initialization goes here.
        //触发事件
        this.collider = this.node.getComponent(cc.ColliderComponent);
        this.collider.on('onTriggerEnter',this.onTrigger,this);
        Con.RepeatPotal=true;
    }
    onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'&&Con.RepeatPotal){
            //随机场景号
            this._ChooseScene = math.randomRangeInt(1,3);
            //跳转开关
            if(this._ChooseScene==1&&Con.BossReSignal==false){
                this.PrefabScene1Prefab();
                Con.JumpSwitch1=true;
                //关闭传送门
                this.node.destroy();
            }
            if(this._ChooseScene==2&&Con.BossReSignal==false){
                this.PrefabScene2Prefab();
                Con.JumpSwitch2=true;
                //关闭传送门
                this.node.destroy();
            }
            //跳转Boss场景
            if(Con.BossReSignal){
                this.PrefabSceneBoss1Prefab();
                Con.JumpSwitchBoss1=true;
                //关闭传送门
                this.node.destroy();
            }
            //删除信号
            Con.DeleteTrap=true;
            Con.DeleteSignal=true;
            //避免重复生成传送门
            Con.RepeatPotal=false;
        }
    }  
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
