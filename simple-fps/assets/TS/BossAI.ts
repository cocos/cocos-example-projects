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
        //子弹计时
        _timer:1,
        //消失计时
        _timer1:0,
        //受击检测
        _ifHunt:false,
        //发动攻击检测
        _ifAttack:false,
        //y轴旋转
        _rotationy:0,
        
        //怪物子弹预设
        BossBulletPrefab: {
            default:null,
            type:cc.Prefab
        },
        
    },

    //实例化怪物子弹
    PrefabBossBullet:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newBossBullet = cc.instantiate(this.BossBulletPrefab);
        scene.addChild(newBossBullet); 
        newBossBullet.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
    },

    // LIFE-CYCLE CALLBACKS:

     start() {
        //碰撞事件
        var collider = this.node.getComponent(cc.ColliderComponent);
        collider.on('onCollisionEnter',this.onCollision,this);
        collider.on('onTriggerEnter',this.onTrigger,this);
     },

     update(dt) {

         //面向并向玩家移动
         const _Player = cc.director.getScene().getChildByName('Player');
         this.node.lookAt(_Player.getPosition());
         const velocity = new cc.Vec3(0,0,-this._MonsterMove);  
         cc.math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());

     
         //攻击间隔
        this._timer+=2*dt;
        if(this._timer>Con.MonsterShoootinterval){
            this.PrefabBossBullet();
            this._timer=0;
        }
        
        //消失间隔
        this._timer1+=1*dt;
        if(this._timer1>5){
            this.node.destroy();
        }

        //锁Y轴 
        if(this.node.getPosition().y < 2 )
        this.node.setPosition(this.node.getPosition().x,2,this.node.getPosition().z)
        if(this.node.getPosition().y > 2)
        this.node.setPosition(this.node.getPosition().x,2,this.node.getPosition().z)

        //受伤扣血
        if(this._ifHunt){
            Con.BossHp -= Con.BulletD;
            this._ifHunt=false;
        }
        //血量低消失
        if(Con.BossHp<=0){
            this.node.destroy();
        }
        //攻击
        if(this._ifAttack){
            Con.PlayerHp-=Con.BossD;
            this._ifAttack=false;
        }
    },

     onCollision (event) {
         //攻击
		if(event.otherCollider.node._name == 'Player'){
            this._ifAttack=true;
        }
        //碰到子弹受伤
        if(event.otherCollider.node._name == 'Bullet'){
            this._ifHunt=true;
        }
    },
});
