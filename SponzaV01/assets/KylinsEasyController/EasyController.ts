import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

export class EasyControllerEvent{
    public static CAMERA_ROTATE:string = 'EasyControllerEvent.CAMERA_ROTATE';
    public static CAMERA_ZOOM:string = 'EasyControllerEvent.CAMERA_ZOOM';
    public static MOVEMENT:string = 'EasyControllerEvent.MOVEMENT';
    public static MOVEMENT_STOP:string = 'EasyControllerEvent.MOVEMENT_STOP';
    public static JUMP:string = 'EasyControllerEvent.JUMP';
}

export class EasyController{

    public static on(type:string,callback:Function,target?:any){
        director.getScene().on(type,callback,target);
    }

    public static off(type:string,callback?:Function,target?:any){
        director.getScene()?.off(type,callback,target);
    }
}