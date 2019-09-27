import { _decorator, Component, Node, Prefab, instantiate, director, ColliderComponent, AnimationComponent, SpriteComponent, Vec3, CameraComponent, math } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';
@ccclass("bossai1")
export class bossai1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    //子弹计时
    private _timer:number=1;
    //消失计时
    private _timer1:number=0;
    //受击检测
    private _ifHunt:boolean=false;
    //发动攻击检测
    private _ifAttack:boolean=false;
    //绕行间隔
    private _DetourTimer:number=0;
    //血条精灵类
    private _sprite:any=null;

    private _anidea:boolean=false;


    private _isanidea:boolean=false;

    private _destroytimer:number=0;

    @property({type:Prefab})
    public BossBulletPrefab: Prefab =null;

    @property({type:Prefab})
    public HPPrefab: Prefab =null;

    private CameraNode:any = null;
    private UINode:any =null;

    private _newHp:any=null;

    private _animationComponent:any =null;

    private collider:any=null;

    //实例化怪物子弹
    PrefabBossBullet(){
        var newBossBullet = instantiate(this.BossBulletPrefab);
        this.node.addChild(newBossBullet); 
        newBossBullet.setPosition(-0.1,1,0.5);
    }
    //实例化UI
    PrefarHP(){
        var canvas= director.getScene().getChildByName('Canvas');
        this._newHp = instantiate(this.HPPrefab);
        canvas.addChild(this._newHp);
        this._newHp.setPosition(0,0,0);
    }
    start () {
        // Your initialization goes here.
        this.PrefarHP();
        //碰撞事件
        this.collider = this.node.getComponent(ColliderComponent);
        this.collider.on('onTriggerEnter',this.onTrigger,this);

        //获取动画组件
        this._animationComponent = this.node.getComponent(AnimationComponent);
        this._animationComponent.play("ShootTorsoArmsRifle", 0.0);

        //获取血量组件
        this._sprite = this._newHp.getComponent(SpriteComponent);
        const CameraNodepp = director.getScene().getChildByName('Player');
        const CameraNodep=CameraNodepp.getChildByName('center');
        this.CameraNode=CameraNodep.getChildByName('Camera');
        this.UINode = this._newHp;
    }

     update (deltaTime: number) {
         // Your update function goes here.
         //血条变化
        this._sprite.fillRange=Con.BossHp/300;
        //血条跟随
        var HpPosition=new Vec3(this.node.getPosition().x,this.node.getPosition().y+1.7,this.node.getPosition().z)
        var ddddd=new Vec3(10,10,10);
        cc.pipelineUtils.WorldNode3DToLocalNodeUI(this.CameraNode.getComponent(CameraComponent),HpPosition,this.UINode,ddddd);
        if(ddddd.z<1){
        this.UINode.setPosition(ddddd);
        }
    if(Con.BossHp>0){
        //面向玩家
        const _Player = director.getScene().getChildByName('Player');
        this.node.lookAt(_Player.getPosition());
        const velocity = new cc.Vec3(0,0,0);  
        math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
        //攻击间隔
        this._timer+=2*deltaTime;
        if(this._timer>Con.MonsterShoootinterval){
            this.PrefabBossBullet();
            this._timer=0;
        }
        //消失间隔
        this._timer1+=1*deltaTime;
        if(this._timer1>5){
            this._newHp.destroy();
            this.node.destroy();
        }
        //锁Y轴 
        if(this.node.getPosition().y < 0 )
        this.node.setPosition(this.node.getPosition().x,0,this.node.getPosition().z)
        if(this.node.getPosition().y > 0)
        this.node.setPosition(this.node.getPosition().x,0,this.node.getPosition().z)
        //受伤扣血
        if(this._ifHunt){
            Con.BossHp -= Con.BulletD;
            this._ifHunt=false;
        }
    }

        //血量低消失播动画
        if(Con.BossHp<=0){
            this._anidea=true;
            if(this._anidea&&this._isanidea==false){
                this._isanidea=true;
                this._animationComponent.stop("ShootTorsoArmsRifle", 0.0);
                this._animationComponent.play("Death1", 0.0);
            }
            if(this._destroytimer>1){
                this._animationComponent.stop("Death1", 0.0);
                this.node.destroy();
            }
        }
        if(this._isanidea){
            this._destroytimer+=1*deltaTime;
        }
        //攻击
        if(this._ifAttack){
            Con.PlayerHp-=Con.BossD;
            this._ifAttack=false;
        }
        //Boss躲避障碍物AI
        if(Con.BossDetour){
            this._DetourTimer+=1*deltaTime;
            const position = this.node.getPosition();
            math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), -deltaTime*2);
            this.node.setPosition(position);
        }
        if(this._DetourTimer>0.5){
            Con.BossDetour=false;
            this._DetourTimer=0;
        }
     }
     _getDirection(x, y, z) {
		const result = new Vec3(x, y, z);
		math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    }
    onTrigger (event) {
        //攻击
       if(event.otherCollider.node._name == 'Player'){
           this._ifAttack=true;
       }
       //碰到子弹受伤
       if(event.otherCollider.node._name == 'Bullet'){
           this._ifHunt=true;
       }
       //碰到树
      if(event.otherCollider.node._name == 'tree'){
           Con.BossDetour=true;
       }
   }
}
