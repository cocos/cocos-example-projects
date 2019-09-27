import { _decorator, Component, Node, Prefab, instantiate, director, math, AnimationComponent, SpriteComponent, RigidBodyComponent, CameraComponent, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("monster1")
export class monster1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
        private _posi:any=null;

        //子弹计时
        private _timer:number=1;
        //受击检测
        private _ifHunt:boolean=false;
        //发动攻击检测
        private _ifAttack:boolean=false;
        //射击距离检测
        private _ifShootDistance:boolean=false;
        //远程小怪或者近战小怪
        private _FarorNear:number=0;
        private  _Switch:boolean=false;
        //与玩家距离
        private _Distance:number=0;
        //怪物移动速度
        private _MonsterMove:number=0;
        //绕树
        private _MonsterDetour:boolean=false;
        //怪物子弹预设
        @property({type:Prefab})
        public MonsterBulletPrefab: Prefab =null;

        //躲避障碍物计时
        private _detourtimer:number=0;
        //消失计时
        private _destroytimer:number=0;
        //受伤计时
        private _hittimer:number=0;
        //动画控制
        private _animationComponent:any=null;
        private _anirun:boolean=false;
        private _isanirun:boolean=false;
        private _anidea:boolean=false;
        private _isanidea:boolean=false;
        private _anihit:boolean=false;
        private _isanihit:boolean=false;
        //血条精灵类
        private _sprite:any=null;
        //怪物子弹预设
        private CameraNode:any=null;
        private UINode:any=null;

        @property({type:Prefab})
        public HPPrefab: Prefab =null;
        private _newHp:any=null;
        private monsterhp :number=0;
        private bulletd :number=0;
        private monsterd :number=0;

        private collider:any=null;

        private rigidbody:any=null;
        //实例化怪物子弹
    PrefabMonsterBullet(){
        var newMonsterBullet = instantiate(this.MonsterBulletPrefab);
        this.node.addChild(newMonsterBullet);
        newMonsterBullet.setPosition(-0.1,1,0.5);
    }

    //实例化HP
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
        this.collider = this.node.getComponent(cc.ColliderComponent);
        this.collider.on('onCollisionStay',this.onCollision,this);
        this.collider.on('onTriggerEnter',this.onTrigger,this);

        this.monsterhp=Con.MonsterHp;
        this.bulletd=Con.BulletD;
        this.monsterd=Con.MonsterD;

        //random自己远程还是近战
        this._FarorNear=math.randomRangeInt(1,3);
        if(this._FarorNear==1){
            this._Switch=true;
        }
        this._MonsterMove=Con.MonsterMoveSpeed;
        //获取动画组件
        this._animationComponent = this.node.getComponent(AnimationComponent);
        //获取血量组件
        this._sprite = this._newHp.getComponent(SpriteComponent);
        const CameraNodepp = director.getScene().getChildByName('Player');
        const CameraNodep=CameraNodepp.getChildByName('center');
        this.CameraNode=CameraNodep.getChildByName('Camera');
        this.UINode = this._newHp;

        this.rigidbody=this.node.getComponent(RigidBodyComponent);
        
    }

     update (deltaTime: number) {
         // Your update function goes here.
          //血量变化
        this._sprite.fillRange=this.monsterhp/Con.MonsterHp;
        //血条跟随
        var HpPosition=new Vec3(this.node.getPosition().x,this.node.getPosition().y+1.7,this.node.getPosition().z)
        var ddddd=new Vec3(10,10,10);
        cc.pipelineUtils.WorldNode3DToLocalNodeUI(this.CameraNode.getComponent(CameraComponent),HpPosition,this.UINode,ddddd);
        if(ddddd.z<1){
        this.UINode.setPosition(ddddd);
        }
        if(this._anidea==false){
        //远程
        if(this._Switch){
           //攻击间隔
           if(this._ifShootDistance){
               this._timer+=1*deltaTime;
               if(this._timer>Con.MonsterShoootinterval&&this._isanihit==false){
                   this._anirun=false;
                   this._animationComponent.play("ShootTorsoArmsRifle", 0.0);
                   this.PrefabMonsterBullet();
                   this._timer=0;
                   this._isanirun=false;
               }
           }else{
               this._anirun=true;
           }
           //面向并向玩家移动
           const _Player = director.getScene().getChildByName('Player');
           this._Distance= math.Vec3.distance(_Player.getPosition(),this.node.getPosition());
           if(this._Distance<10){
               this._MonsterMove=0;
               this._ifShootDistance=true;
           }else{
               this._MonsterMove=Con.MonsterMoveSpeed;
               this._ifShootDistance=false;
           }
           this.node.lookAt(_Player.getPosition());
           const velocity = new Vec3(0,0,-this._MonsterMove);  
           math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
           this.rigidbody.setLinearVelocity(velocity);

           if(this._anirun&&this._isanirun==false){
               this._animationComponent.play("Run", 0.0);
               this._isanirun=true;
           }
       }
       
       //近战
       if(this._Switch==false){
           //面向并向玩家移动
           this._anirun=true;
           const _Player = director.getScene().getChildByName('Player');
           this.node.lookAt(_Player.getPosition());
           const velocity = new cc.Vec3(0,0,-this._MonsterMove);  
           math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
           this.rigidbody.setLinearVelocity(velocity);

           if(this._anirun&&this._isanirun==false){
               this._animationComponent.play("Run", 0.0);
               this._isanirun=true;
           }
       }

       //锁Y轴 
       if(this.node.getPosition().y < 0 )
       this.node.setPosition(this.node.getPosition().x,0,this.node.getPosition().z)
       if(this.node.getPosition().y > 0)
       this.node.setPosition(this.node.getPosition().x,0,this.node.getPosition().z)

       //受伤扣血
       if(this._ifHunt){
           //击退效果
           const velocity = new Vec3(0,0,20);  
           math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
           this.rigidbody.setLinearVelocity(velocity);

           this.monsterhp -= this.bulletd;
           this._ifHunt=false;

           this._anihit=true;
       }
       if(this._anihit&&this._isanihit==false){
           this._anihit=true;
           this._animationComponent.play("Hit", 0.0);
           if(this.monsterhp<0){
               this.monsterhp=0;
           }
           this._isanihit=true;
       }
       if(this._anihit){
           this._hittimer+=1*deltaTime;
       }
       if(this._hittimer>0.3){
           this._anihit=false;
           this._isanihit=false;
           this._isanirun=false;
           this._hittimer=0;
       }

       //攻击
       if(this._ifAttack){
           Con.PlayerHit=true;
           Con.PlayerHp-=this.monsterd;
           this._ifAttack=false;
       }
       //敌人绕树AI
       if(this._MonsterDetour){
           this._detourtimer+=1*deltaTime
           this._MonsterMove=0;
           const position = this.node.getPosition();
           math.Vec3.scaleAndAdd(position, position, this._getDirection(1,0,0), -deltaTime*1);
           this.node.setPosition(position);
       }
       if(this._detourtimer>0.5){
           this._MonsterDetour=false;
           Con.rrrrrr=false;
           this._detourtimer=0;
           this._MonsterMove=Con.MonsterMoveSpeed;
       }
   }
       //血量低消失
       if(this.monsterhp<=0){
           this._anidea=true;
           if(this._anidea&&this._isanidea==false){
               this._isanidea=true;
               this._animationComponent.play("Death1", 0.0);
           }
           if(this._destroytimer>1){
               this._animationComponent.stop("Run", 0.0);
               this._animationComponent.stop("ShootTorsoArmsRifle", 0.0);
               this._animationComponent.stop("Death1", 0.0);
               this._newHp.destroy();
               this.node.destroy();
           }
       }
       if(this._isanidea){
           this._destroytimer+=1*deltaTime;
       }
       if(Con.rrrrrr){
        this._MonsterDetour=true;
       }
     }
    //这里原本是触发器出现问题该回去
    onTrigger (event) {
         //攻击
		if(event.otherCollider.node._name == 'Player'){
            this._ifAttack=true;
        }
        //碰到子弹受伤
        if(event.otherCollider.node._name == 'Bullet'){
            this._ifHunt=true;
        }
        
    }
    onCollision(event){
        //碰到树
        if(event.otherCollider.node!=null){
            if(event.otherCollider.node._name == 'tree'){
                this._MonsterDetour=true;
            }
        }
    }
    _getDirection(x, y, z) {
		const result = new Vec3(x, y, z);
		math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    }
}
