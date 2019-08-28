import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("bossbullet1")
export class bossbullet1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _timer:number=0;

    private _x:number=0;

    private  _rotationy:number=0;

    private collider:any=null;
    private rigidbody:any=null;

    private ParentNode:any=null;

    start () {
        // Your initialization goes here.
        //触发事件
        this.collider = this.node.getComponent(cc.ColliderComponent);
		this.collider.on('onTriggerEnter',this.onTrigger,this);
        
        //面向并向玩家移动
      /*  this._Player = cc.director.getScene().getChildByName('Player');
        this.node.lookAt(this._Player.getPosition());
        const velocity = new cc.Vec3(0,0,10);  
        this.rigidbody=this.node.getComponent(cc.RigidBodyComponent);
        this.rigidbody.setLinearVelocity(velocity);
*/
        this.ParentNode = this.node.getParent();
        const velocity = new cc.Vec3(0,0,-10);
        if(this.ParentNode!=null){
        const q = this.ParentNode.getWorldRotation();
        cc.math.Vec3.transformQuat(velocity,velocity,q);
        this.rigidbody=this.node.getComponent(cc.RigidBodyComponent);
        this.rigidbody.setLinearVelocity(velocity);
        }
    }

     update (deltaTime: number) {
         // Your update function goes here.
         //子弹消失手动计时器
        this._timer += 1 *deltaTime;
        if(this._timer>=Con.MonsterBulletRange){
            this.node.destroy();
        }
     }
     onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'){
            Con.PlayerHp-=20; 
            this.node.destroy();
        }
        if(event.otherCollider.node._name == 'tree'){
            Con.BossDetour=true;
            this.node.destroy();
        }
    }
}
