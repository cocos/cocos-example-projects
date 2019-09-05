import { _decorator, Component, Node, Prefab, director, instantiate, math } from "cc";
const { ccclass, property } = _decorator;

import { Con } from './Constants';
@ccclass("remonster1")
export class remonster1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _timer:number=0;
    //刷怪
    private _IsRe:boolean=false;
    //刷Boss
    private _IsBoss:boolean=false;

    //刷新Boss位置范围
    private _ReBossx:number=0;
    private _ReBossz:number=0;

    //刷新敌人位置范围
    private _ReMonsterx:number=0;
    private _ReMonsterz:number=0;

    //刷新敌人数量范围
    private _ReMMinCount:number=0;
    private _ReMMaxCount:number=0;

    //刷新陷阱位置范围
    private _ReTrapx:number=0;
    private _ReTrapz:number=0;

    @property({type:Prefab})
    public MonsterPrefab: Prefab =null;
    @property({type:Prefab})
    public BossPrefab: Prefab =null;
    @property({type:Prefab})
    public TrapPrefab: Prefab =null;

    //实例化敌人
    PrefabMonster(){
        var scene= director.getScene();
        var newMonster = instantiate(this.MonsterPrefab);
        scene.addChild(newMonster);
        newMonster.setPosition(this.node.getParent().getPosition().x-this._ReMonsterx,1,this.node.getParent().getPosition().z-this._ReMonsterz);
    }

    //实例化Boss
    PrefabBoss(){
        var scene= director.getScene();
        var newBoss = instantiate(this.BossPrefab);
        scene.addChild(newBoss);
        newBoss.setPosition(this.node.getParent().getPosition().x-this._ReBossx,1,this.node.getParent().getPosition().z-this._ReBossz);
    }

    //实例化陷阱 
    PrefabTrap(){
        var newTrap = instantiate(this.TrapPrefab);
        this.node.addChild(newTrap);
        newTrap.setPosition(this.node.getPosition().x-this._ReTrapx,0,this.node.getPosition().z-this._ReTrapz);
    }

    start () {
        // Your initialization goes here.
        this._IsRe=true;
        this._IsBoss=true;
        if(this._IsBoss&&Con.BossReSignal&&Con.AlreadyReMonster==false){
        this.PrefabBoss();
        this._IsBoss=false;
        //开启Boss活动
        Con.BossBehavior=true;
        }
    }

     update (deltaTime: number) {
         // Your update function goes here.
         //刷怪位置数量控制    
        if(this._IsRe&&Con.BossReSignal==false){
            this._ReMMinCount = math.randomRange(1,2);
            this._ReMMaxCount = math.randomRange(3,4);  
            for(this._ReMMinCount;this._ReMMinCount<this._ReMMaxCount;this._ReMMinCount++){
                this._ReMonsterx = math.randomRange(-8,8);
                this._ReMonsterz = math.randomRange(-8,8);
                this._ReTrapx = math.randomRange(-8,8);
                this._ReTrapz = math.randomRange(-8,8);
                Con.HpNumber++;
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
            this._timer+=1*deltaTime;
            if(this._timer>8){
                this._ReBossx = math.randomRange(-8,8);
                this._ReBossz = math.randomRange(-8,8);
                this.PrefabBoss();
                this._timer=0;
            }
         }
     }
}
