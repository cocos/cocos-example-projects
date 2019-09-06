import { _decorator, Component } from "cc";
const { ccclass} = _decorator;

@ccclass("Con")
export class Con extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    //玩家信息
    //人称转换
    public static PersonChange:boolean=false;
    //玩家血量
    public static PlayerHp:number=100;
    //玩家移动速度
    public static PlayerSpeed:number=5;
    //玩家跳跃速度
    public static PlayerJump:number=5;
    //玩家后坐力开关
    public static RecoilSwitch:boolean=false;
    //玩家受伤信号
    public static PlayerHit:boolean=false;
    //方向控制
    public static startForward:boolean=false;
    public static startRight:boolean=false;
    public static startLeft:boolean=false;
    public static startBackward:boolean=false;
    public static startJump:boolean=false;
    public static startShoot:boolean=false;
    //按钮监听信号
    public static buttonevent:boolean=false;
    //子弹信息
    //子弹伤害
    public static BulletD: number =30;
    //子弹射程，用存在时间来代表射程，方便之后可以折之后的计算
    public static BulletRange:number = 3;
    //射击间隔
    public static Shoootinterval:number = 0.3;  //之前是5
    //子弹速度
    public static BulletMoveSpeed:number=25;

    //敌人信息
    //敌人血量
    public static MonsterHp: number = 100;
    //敌人伤害
    public static MonsterD: number = 20;
    //敌人子弹速度
    public static MonsterBulletSpeed:number =10;
    //敌人移动速度
    public static MonsterMoveSpeed:number = 10;
    //敌人攻击间隔
    public static MonsterShoootinterval:number = 1;
    //敌人子弹射程，用存在时间来代表射程，方便之后折计算
    public static MonsterBulletRange:number =3;
    //血量计数
    public static HpNumber:number=0;

    public static rrrrrr:boolean=false;

    //Boss相关控制
    //Boss出现信号
    public static BossReSignal:boolean=false;
    //Boss行为控制
    public static BossBehavior:boolean=false;
    //Boss场景控制
    public static JumpSwitchBoss1:boolean=false;
    //Boss血量
    public static BossHp:number=300;
    //Boss伤害
    public static BossD:number=50;
    //Boss绕行
    public static BossDetour:boolean=false;



    //刷怪控制
    //已经刷新了敌人
    public static AlreadyReMonster:boolean =false;
    //已经产生了道具
    public static AlredyReProps:boolean = false;

    //场景控制
    //删除已有场景,切换场景信号
    public static DeleteSignal:boolean = false;
    //删除陷阱信号
    public static DeleteTrap:boolean=false;
    //场景切换多次重复控制
    public static RepeatPotal:boolean = false;
    //第一个场景控制
    public static JumpSwitch1:boolean =false;
    //第二个场景控制
    public static JumpSwitch2:boolean =false;
   
    //关卡控制
    //关卡总数
    public static _LevelsCount:number = 0;
    //当前关卡数
    public static _AtLevel:number = 0;

    //动画控制
    //跑步动画
    public static AniRun:boolean=false;
    public static isanirun:boolean=false;
    public static isanirunshoot:boolean=false;
    //站立动画
    public static AniIdle:boolean=true;
    public static isaniidleshoot:boolean=true;
    //走路动画
    public static AniWalk:boolean=false;
    //跳跃动画
    public static AniJump:boolean=false;
    public static isanijump:boolean=false;
    public static isanijumpshoot:boolean=false;
    //射击动画
    public static AniShoot:boolean=false;
    public static isanishoot:boolean=false;
    //受伤动画
    public static AniHit:boolean=false;
    public static isanihit:boolean=false;
    //结束动画
    public static AniDel:boolean=false;
    //跑着打的时候松开了键盘
    public static Anirunshoottoidleshoot:boolean=false;
    //站着打的时候按下键盘
    public static Aniidleshoottorunshoot:boolean=false;

}
