import { _decorator, Component, Node, math, director, Vec3, RigidBodyComponent, ColliderComponent } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("bullet1")
export class bullet1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    //弹道扩散范围
    private spreadx:number=0;
    private spready:number=0;
    private _timer:number=0;

    private collider:any=null;
    private rigidbody:any=null;

    start () {
        // Your initialization goes here.
         //弹道扩散范围
         if(Con.RecoilSwitch==false){
            this.spreadx = math.randomRange(-0.5,0.5);
            this.spready = math.randomRange(0,0.5);
         }
         if(Con.RecoilSwitch){
            this.spreadx = 0;
            this.spready = 0;
        }
        //获取父节点，转世界坐标，赋予线性速度
        const Player = director.getScene().getChildByName('Player');
        const center = Player.getChildByName('center');
        //弹道
        const velocity = new Vec3(this.spreadx,this.spready,-Con.BulletMoveSpeed);
        const q = center.getWorldRotation();
        math.Vec3.transformQuat(velocity,velocity,q);
        this.rigidbody=this.node.getComponent(RigidBodyComponent);
        this.rigidbody.setLinearVelocity(velocity);

        //碰撞事件
        this.collider = this.node.getComponent(ColliderComponent);
        this.collider.on('onTriggerEnter',this.onTrigger,this);
    }

     update (deltaTime: number) {
         // Your update function goes here.
          //子弹消失手动计时器
        this._timer += 1 *deltaTime;
        if(this._timer>=Con.BulletRange){
            this.node.destroy();
        }
     }
     //碰撞事件
     onTrigger (event) {
		if(event.otherCollider.node._name == 'AirWell'||event.otherCollider.node._name == 'Monster'||event.otherCollider.node._name == 'tree'){
            this.node.destroy();
        }
    }
}
