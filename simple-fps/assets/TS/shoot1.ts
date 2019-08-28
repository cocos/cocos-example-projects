import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("shoot1")
export class shoot1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;


    //控制射击速度
    private _timer:number=0;
    //持续射击
    private _ifcontinuous:boolean=false;


    @property({type:Prefab})
    public BulletPrefab: Prefab =null;

    //实例化子弹
    PrefabBullet(){
        const Player = this.node.getWorldPosition();
        var scene = cc.director.getScene();
        var newBullet = cc.instantiate(this.BulletPrefab);
        scene.addChild(newBullet);
        newBullet.setPosition(Player.x,Player.y,Player.z);
    }

    onLoad() {
        //鼠标监听
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);   
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_UP,this.onMouseUp,this);     
     }

     onMouseDown(event) {
        if (event.getButton() === 0&&this._timer>Con.Shoootinterval) {
            this.PrefabBullet();
            this._ifcontinuous=true;
            this._timer=0;
        } 
    }

    onMouseUp(event){
        if (event.getButton() === 0) {
            this._ifcontinuous=false;
        } 
    }

    start () {
        // Your initialization goes here.
    }

     update (deltaTime: number) {
         // Your update function goes here.
         this._timer +=1*deltaTime;
         //持续射击
         if(this._ifcontinuous==true&&this._timer>Con.Shoootinterval){
            this.PrefabBullet();
            this._timer=0;
         }
     }
}
