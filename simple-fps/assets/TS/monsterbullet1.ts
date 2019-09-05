import { _decorator, Component, Node, Vec3, math, RigidBodyComponent, ColliderComponent } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("monsterbullet1")
export class monsterbullet1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _timer:number=0;

    private ParentNode:any=null;

    private collider:any=null;
    private rigidbody:any=null;

    start () {
        // Your initialization goes here.
        //获取父节点，转世界坐标，赋予线性速度
        this.ParentNode = this.node.getParent();
        const velocity = new Vec3(0,0,-Con.MonsterBulletSpeed);
        if(this.ParentNode!=null){
        const q = this.ParentNode.getWorldRotation();
        math.Vec3.transformQuat(velocity,velocity,q);
        this.rigidbody=this.node.getComponent(RigidBodyComponent);
        this.rigidbody.setLinearVelocity(velocity);
        }

        //触发事件
        this.collider = this.node.getComponent(ColliderComponent);
		this.collider.on('onTriggerEnter',this.onTrigger,this);
    }

     update (deltaTime: number) {
         // Your update function goes here.
         if(this.node.getPosition().y>1){
            this.node.setPosition(this.node.getPosition().x,1,this.node.getPosition().z);
        }
        //子弹消失手动计时器
        this._timer += 1 *deltaTime;
        if(this._timer>=Con.MonsterBulletRange){
            this.node.destroy();
        }
     }
     onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'){
            Con.PlayerHit=true;
            Con.PlayerHp-=20;   
            this.node.destroy();
        }
        if(event.otherCollider.node._name == 'tree'){
            Con.rrrrrr=true;
            this.node.destroy();
        }
    }
}
