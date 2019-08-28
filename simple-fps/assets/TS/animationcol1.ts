import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("animationcol1")
export class animationcol1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _animationComponent:any=null;
    private _isanideath1:boolean=false;
    onLoad(){
        this._animationComponent = this.node.getComponent(cc.AnimationComponent);
     }
    start () {
        // Your initialization goes here.
    }

     update (deltaTime: number) {
         // Your update function goes here.
         if(Con.AniHit&&Con.isanihit==false){
            Con.AniIdle=false;
            this._animationComponent.play("Hit", 0.0);
            Con.isanihit=true;
         }else{
            if(Con.AniRun&&Con.AniJump==false&&Con.isanirun==false&&Con.AniShoot==false){
                Con.AniIdle=false;
                this._animationComponent.play("Run", 0.0);
                Con.isanirun=true;
            }
            if(Con.AniRun&&Con.AniJump==false&&Con.AniShoot&&Con.isanirunshoot==false){
                Con.AniIdle=false;
                this._animationComponent.play("RunGun", 0.0);
                Con.Anirunshoottoidleshoot=true;
                Con.isanirunshoot=true;
            }
            if(Con.AniIdle&&Con.isaniidleshoot==false&&Con.AniShoot==false){
                this._animationComponent.play("Idle", 0.0);
            }
            if(Con.AniIdle&&Con.AniShoot&&Con.isaniidleshoot==false){
                Con.isaniidleshoot=true;
                Con.AniIdle=false;
                Con.Aniidleshoottorunshoot=true;
                this._animationComponent.play("ShootTorsoArmsRifle", 0.0);
            }
            if(Con.AniJump&&Con.isanijump==false){
                Con.AniIdle=false;
                this._animationComponent.play("Jump", 0.0);
                Con.isanijump=true;
            }
            if(Con.AniJump&&Con.AniShoot&&Con.isanijumpshoot==false){
                Con.AniIdle=false;
                this._animationComponent.play("JumpGun", 0.0);
                Con.isanijumpshoot=true;
            }
         }
        if(Con.AniDel&&this._isanideath1==false){
            this._animationComponent.play("Death1", 0.0);
            this._isanideath1=true;
        }
     }
}
