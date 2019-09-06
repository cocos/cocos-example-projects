import { _decorator, Component, Node, systemEvent, SystemEvent, math, director, Vec3, Vec2 } from "cc";
const { ccclass, property } = _decorator;
import { Con } from './Constants';

@ccclass("recoil1")
export class recoil1 extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _recoil:boolean=false;
    private _RecoilTime:number=0;
    private _RecoilRange:number=0;

    onLoad() {
        
        //鼠标监听
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_MOVE,this.onMouseMove,this); 
        
        //触摸监听
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE,this.onTouchMove,this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END,this.onTouchEnd,this);
        systemEvent.on(SystemEvent.EventType.TOUCH_START,this.onTouchStart,this);
        
     }

     onMouseDown(event) {
        if (event.getButton() === 0) {
            //后坐力
            this._recoil=true;
        } 
    }
    onMouseUp(event){
        if (event.getButton() === 0) {
        this._recoil=false;
        }
    }
    onMouseMove(event){
        if(event.movementY!=0){
        const rotationy = this.node.getRotation();
        math.Quat.rotateAround(rotationy,rotationy,this._getDirection(-1, 0, 0), event.movementY/5/ 360.0 * 3.1415926535);
        this.node.setRotation(rotationy);
        }
    }
    
    onTouchMove(event){
        if(event.getDelta().y!=0){
            const up =cc.v3(0,1,0);
            const rotationx = this.node.getRotation();
            math.Quat.rotateAround(rotationx, rotationx,this._getDirection(-1, 0, 0), -event.getDelta().y/5/ 360.0 * 3.1415926535);
            this.node.setRotation(rotationx);
        }
    }

    onTouchEnd(event){
        this._recoil=false;
    }

    onTouchStart(event){
        this._recoil=true;
        
    }


     update (deltaTime: number) {
         // Your update function goes here.
         //锁定视角
         if(this.node.eulerAngles.x<-35){
            this.node.setRotationFromEuler(-35,this.node.eulerAngles.y,this.node.eulerAngles.z)
        }
        if(this.node.eulerAngles.x>17){
            this.node.setRotationFromEuler(17,this.node.eulerAngles.y,this.node.eulerAngles.z)
        }
        //后坐力模拟
        if(Con.RecoilSwitch){
            if(this._recoil){
                this._RecoilTime+=1*deltaTime;
            }
            if(this._RecoilTime>0.5){
                this._RecoilRange = math.randomRange(-0.2,0.2);
                this.node.setRotationFromEuler(this.node.eulerAngles.x+0.05,this.node.eulerAngles.y+this._RecoilRange,this.node.eulerAngles.z);
            }
            if(this._recoil==false){
                this._RecoilTime=0;
                this.node.setRotationFromEuler(this.node.eulerAngles.x,180,this.node.eulerAngles.z);
            }
        }
     }
     _getDirection(x, y, z) {
		const result = new Vec3(x, y, z);
		math.Vec3.transformQuat(result, result, this.node.getRotation());
		return result;
    }
}
