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

        _timer:0,

        _x:0,

        _rotationy:0,
    },
    // LIFE-CYCLE CALLBACKS:
     start() {
        //弹道
        /*
         //获取父节点，转世界坐标，赋予线性速度  子弹方向有点小问题 有的怪总不知道在看谁
        this.ParentNode = cc.director.getScene().getChildByName('Boss1');
        const velocity = new cc.Vec3(0,0,-Con.MonsterBulletSpeed);
        if(this.ParentNode!=null){
        const q = this.ParentNode.getRotation();
        cc.math.Vec3.transformQuat(velocity,velocity,q);
        this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);
        }
        */
        //触发事件
        var collider = this.node.getComponent(cc.ColliderComponent);
		collider.on('onTriggerEnter',this.onTrigger,this);
     }, 
    update(dt){
        //面向并向玩家移动
        const _Player = cc.director.getScene().getChildByName('Player');
        this.node.lookAt(_Player.getPosition());
        const velocity = new cc.Vec3(0,0,-10);  
        cc.math.Vec3.transformQuat(velocity,velocity,this.node.getRotation());
        this.node.getComponent(cc.RigidBodyComponent).setLinearVelocity(velocity);
        //子弹消失手动计时器
        this._timer += 1 *dt;
        if(this._timer>=Con.MonsterBulletRange){
            this.node.destroy();
        }
    },

     onTrigger (event) {
		if(event.otherCollider.node._name == 'Player'){
            Con.PlayerHp-=30;   //数字方便测试 不合理！！！！！！！
            this.node.destroy();
        }
    },  
});
