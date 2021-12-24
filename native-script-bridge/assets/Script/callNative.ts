
import { _decorator, Component, Node, Label, color, Color, MeshRenderer, Canvas, UITransform, Light, View, jsEventHandler, JsEventHandler, Game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CallNative')
export class CallNative extends Component {
    //static eventMap: Map<string, Function> = new Map<string, Function>();    
    @property(Label)
    public labelForContent: Label | undefined;
    @property(Label)
    public labelForColor: Label | undefined;
    @property(Light)
    public lightToChange: Light | undefined;
    start() {
        this.registerAllScriptEvent();

    }

    public registerAllScriptEvent() {
        jsb.jsEventHandler.addCallback("changeLabelContent", (usr: string) => {
            this.changeLabelContent(usr);
        });
        jsb.jsEventHandler.addCallback("changeLabelColor", () => {
            this.changeLabelColor();
        });
        jsb.jsEventHandler.addCallback("changeLightColor", () => {
            this.changeLightColor();
        });
    }
    //Methods to apply
    public changeLabelContent(user: string): void {
        console.log("Hello " + user + " I'm K");
        this.labelForContent!.string = "Hello " + user + " ! I'm K";


    }
    public changeLabelColor(): void {
        this.labelForColor!.color = new Color("#B8F768");
        this.labelForContent!.color = new Color("#87E9B2");
    }
    public changeLightColor(): void {
        this.lightToChange!.color = new Color("#90FF03");
    }

    //Button click event for SAY HELLO
    public sayHelloBtn() {
        jsb.jsEventHandler.dispatchNativeEvent("requestLabelContent");
    }

    //Button click event for CHANGE LABEL COLOR
    public changeLabelColorBtn() {
        jsb.jsEventHandler.dispatchNativeEvent("requestLabelColor");
    }

    public changeLightColorBtn() {
        jsb.jsEventHandler.dispatchNativeEvent("requestBtnColor", "50");
    }

    private defaultEvent = "default";
    private defaultEventCbCount = 0;
    private myCbList: jsb.JsCallback[] = [];
    public addOneCallback() {
        var self = this;
        var cb = (arg0: string) => {
            console.log(`trigger time with for event ${this.defaultEvent} with arg0 ${arg0} and defaultEventCbCount ${self.defaultEventCbCount} `);
        }
        this.myCbList.push(cb);
        jsb.jsEventHandler.addCallback(this.defaultEvent,cb)
    }

    /**
     * Use a self defined map to save references to callback
     */
    private eventId = 0;
    private selfEventMap: Map<number, jsb.JsCallback[]> = new Map();
    public add100Callback() {
        var self = this;
        for (var i = 0; i < 100; i++) {
            var cb = (arg0: string) => {
                console.log(`add one hundred for event ${self.eventId} with callback id ${i}`);
            }
            jsb.jsEventHandler.addCallback(self.eventId.toString(), cb);
            this.selfEventMap.set(this.eventId,[]);
            //Push callback references to selfEventMap
            this.selfEventMap.get(this.eventId)?.push(cb);
        }
        this.eventId++;
    }

    /**
     * Remove one callback from default eventmap
     */
    public removeOneCallback() {
        jsb.jsEventHandler.removeCallback(this.defaultEvent,this.myCbList[0]);
        jsb.garbageCollect();
    }

    public remove100Callback() {
        var arr = this.selfEventMap.get(this.eventId)!;
        for(var i = 0;i<100;i++){
            jsb.jsEventHandler.removeCallback(this.eventId.toString(), arr[0]);
            arr.slice(0,1);
        }
        jsb.garbageCollect();
    }
    public removeOneEvent(){
        jsb.jsEventHandler.removeEvent(this.eventId.toString());
        this.selfEventMap.get(this.eventId)?.slice(0,this.selfEventMap.get(this.eventId)?.length);
        this.selfEventMap.delete(this.eventId);
        this.eventId--;
    }
    public removeAllEvent(){
        while(this.eventId>0){
            jsb.jsEventHandler.removeEvent(this.eventId.toString());
            //if we should delete arr??
            this.selfEventMap.delete(this.eventId);
            this.eventId--;
        }
    }
    
}