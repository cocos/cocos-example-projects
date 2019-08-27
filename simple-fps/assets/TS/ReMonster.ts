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
        //刷怪
        _IsRe:false,
        //刷Boss
        _IsBoss:false,

        //刷新Boss位置范围
        _ReBossx:0,
        _ReBossz:0,

        //刷新敌人位置范围
        _ReMonsterx:0,
        _ReMonsterz:0,

        //刷新敌人数量范围
        _ReMMinCount:0,
        _ReMMaxCount:0,

        //刷新陷阱位置范围
        _ReTrapx:0,
        _ReTrapz:0,

        MonsterPrefab: {
            default:null,
            type:cc.Prefab
        },
        BossPrefab: {
            default:null,
            type:cc.Prefab
        },
        TrapPrefab: {
            default:null,
            type:cc.Prefab
        },
    },

    //实例化敌人
    PrefabMonster:function(){
        var scene= cc.director.getScene();
        var newMonster = cc.instantiate(this.MonsterPrefab);
        scene.addChild(newMonster);
        newMonster.setPosition(this.node.getParent().getPosition().x-this._ReMonsterx,2,this.node.getParent().getPosition().z-this._ReMonsterz);
    },

    //实例化Boss
    PrefabBoss:function(){
        var scene= cc.director.getScene();
        var newBoss = cc.instantiate(this.BossPrefab);
        scene.addChild(newBoss);
        newBoss.setPosition(this.node.getParent().getPosition().x-this._ReBossx,2,this.node.getParent().getPosition().z-this._ReBossz);
    },

    //实例化陷阱    陷阱加入子物体未解决 删除陷阱问题！！！！！！！！！！！！！！！！！！！
    PrefabTrap:function(){
        const Player = this.node.getWorldPosition();
        var scene= cc.director.getScene();
        var newTrap = cc.instantiate(this.TrapPrefab);
        this.node.addChild(newTrap);
        newTrap.setPosition(this.node.getPosition().x-this._ReTrapx,1,this.node.getPosition().z-this._ReTrapz);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad(){

    },

     start() {
       this._IsRe=true;
       this._IsBoss=true;

       if(this._IsBoss&&Con.BossReSignal&&Con.AlreadyReMonster==false){
        this.PrefabBoss();
        this._IsBoss=false;
        //开启Boss活动
        Con.BossBehavior=true;
    }

        //测试用记得删
     //  this.PrefabBoss();
     //   Con.BossBehavior=true;
     },

     update(dt) {  
         //刷怪位置数量控制    
        if(this._IsRe&&Con.BossReSignal==false){
            this._ReMMinCount = cc.math.randomRange(1,2);
            this._ReMMaxCount = cc.math.randomRange(3,4);  
            for(this._ReMMinCount;this._ReMMinCount<=this._ReMMaxCount;this._ReMMinCount++){
                this._ReMonsterx = cc.math.randomRange(-8,8);
                this._ReMonsterz = cc.math.randomRange(-8,8);
                this._ReTrapx = cc.math.randomRange(-8,8);
                this._ReTrapz = cc.math.randomRange(-8,8);
                this.PrefabMonster();
                this.PrefabTrap();
            }
            //传送时让关卡数加一
            Con._AtLevel++;
            this._IsRe=false;
            Con.AlreadyReMonster=true;
        }

        //刷Boss数量控制 
         if(Con.BossBehavior&&Con.BossHp>0){
            this._timer+=1*dt;
            if(this._timer>8){
                this._ReBossx = cc.math.randomRange(-8,8);
                this._ReBossz = cc.math.randomRange(-8,8);
                this.PrefabBoss();
                this._timer=0;
            }
         }
     },
});
