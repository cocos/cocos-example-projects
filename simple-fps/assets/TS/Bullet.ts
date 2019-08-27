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
        //弹道扩散范围
        spreadx:0,
        spready:0,

        _timer:0,                

        PlayerPrefab: {
            default:null,
            type:cc.Node
        },    
    },
    // LIFE-CYCLE CALLBACKS:
     start() {
         //弹道扩散范围
         if(Con.RecoilSwitch==false){
        this.spreadx = cc.math.randomRange(-0.5,0.5);
        this.spready = cc.math.randomRange(0,0.5);
         }
         if(Con.RecoilSwitch){
            this.spreadx = 0;
            this.spready = 0;
        }


         //获取父节点，转世界坐标，赋予线性速度
        this.PlayerPrefab1 = cc.director.getScene().getChildByName('Player');
        this.PlayerPrefab = this.PlayerPrefab1.getChildByName('center');
        //弹道
        const velocity = new cc.Vec3(this.spreadx,this.spready,-Con.BulletMoveSpeed);
        
        const q = this.PlayerPrefab.getWorldRotation();
        cc.math.Vec3.transformQuat(velocity,velocity,q);
        this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);

        //碰撞事件
        var collider = this.node.getComponent(cc.ColliderComponent);
        collider.on('onCollisionEnter',this.onCollision,this);
        collider.on('onTriggerEnter',this.onTrigger,this);
     },

     update(dt) {
         //子弹消失手动计时器
        this._timer += 1 *dt;
        if(this._timer>=Con.BulletRange){
            this.node.destroy();
        }
     },
     //碰撞事件    原本是碰撞出问题改回去
     onTrigger (event) {
		if(event.otherCollider.node._name == 'AirWell'||event.otherCollider.node._name == 'Monster'){
            this.node.destroy();
        }
    },
});
