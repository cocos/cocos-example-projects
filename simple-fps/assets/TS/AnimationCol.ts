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
        _animationComponent:null,
    },
    // LIFE-CYCLE CALLBACKS:
     start() {
        this._animationComponent = this.node.getComponent(cc.AnimationComponent);
        
     },

     update(dt){
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

        if(Con.AniDel){
            this._animationComponent.play("Death1", 0.0);
        }
        
     },
});
