// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { Con } from './Constants';

cc.Class({
    extends: cc.Component,


    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        _timer:1,
        //受击检测
        _ifHunt:false,
        //发动攻击检测
        _ifAttack:false,

        //远程小怪或者近战小怪
        _FarorNear:0,
        _Switch:false,

        //与玩家距离
        _Distance:0,

        //怪物移动速度
        _MonsterMove:0,
        
        //怪物子弹预设
        MonsterBulletPrefab: {
            default:null,
            type:cc.Prefab
        },
        /*
        //爆炸粒子效果预设
        BoomPrefab: {
            default:null,
            type:cc.Prefab
        },
        */
    },

    //实例化怪物子弹
    PrefabMonsterBullet:function(){
        var scene= cc.director.getScene();
        var newMonsterBullet = cc.instantiate(this.MonsterBulletPrefab);
        this.node.addChild(newMonsterBullet);
        newMonsterBullet.setPosition(0,0,0);
    },
/*
    //实例化爆炸效果
    PrefabBoom:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newBoom = cc.instantiate(this.BoomPrefab);
        scene.addChild(newBoom);
        newBoom.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
    },
*/
    // LIFE-CYCLE CALLBACKS:

     start() {
        //碰撞事件
        var collider = this.node.getComponent(cc.ColliderComponent);
        collider.on('onCollisionEnter',this.onCollision,this);
        collider.on('onTriggerEnter',this.onTrigger,this);

        this.monsterhp=Con.MonsterHp;
        this.bulletd=Con.BulletD;
        this.monsterd=Con.MonsterD;

        //random自己远程还是近战
        this._FarorNear=cc.math.randomRangeInt(1,3);
        if(this._FarorNear==1){
            this._Switch=true;
        }
        this._MonsterMove=Con.MonsterMoveSpeed;
     },

     update(dt) {
         //远程
         if(this._Switch){
            //攻击间隔
            this._timer+=1*dt;
            if(this._timer>Con.MonsterShoootinterval){
                this.PrefabMonsterBullet();
                this._timer=0;
            }
            //面向并向玩家移动
            const _Player = cc.director.getScene().getChildByName('Player');
            this._Distance= cc.math.Vec3.distance(_Player.getPosition(),this.node.getPosition());
            if(this._Distance<10){
                this._MonsterMove=0;
            }else{
                this._MonsterMove=Con.MonsterMoveSpeed;
            }
            this.node.lookAt(_Player.getPosition());
            const velocity = new cc.Vec3(0,0,-this._MonsterMove);  
            cc.math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
            this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);
        }
        
        //近战
        if(this._Switch==false){
            //面向并向玩家移动
            const _Player = cc.director.getScene().getChildByName('Player');
            this.node.lookAt(_Player.getPosition());
            const velocity = new cc.Vec3(0,0,-this._MonsterMove);  
            cc.math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
            this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);
        }
  
        //锁Y轴 
        if(this.node.getPosition().y < 2 )
        this.node.setPosition(this.node.getPosition().x,2,this.node.getPosition().z)
        if(this.node.getPosition().y > 2)
        this.node.setPosition(this.node.getPosition().x,2,this.node.getPosition().z)

        //受伤扣血
        if(this._ifHunt){
            //击退效果
            const velocity = new cc.Vec3(0,0,50);  
            cc.math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
            this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);

            this.monsterhp -= this.bulletd;
            this._ifHunt=false;
        }
        //血量低消失
        if(this.monsterhp<=0){
         /*   this.PrefabBoom();*/
            this.node.destroy();
        }
        //攻击
        if(this._ifAttack){
            Con.PlayerHit=true;
            Con.PlayerHp-=this.monsterd;
            this._ifAttack=false;
        }
    },
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
    },
    //怪物撞墙掉头AI 没写 等写完道具在写，看时间，或者有资源再写！！！！！！！！！！
    /*
    onTrigger (event) {
		if(event.otherCollider.node._name == 'wall'){
            this.node.setRotation();
        }
    },   
*/
});
