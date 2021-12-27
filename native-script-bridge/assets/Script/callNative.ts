
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
    private addOneCallback() {
        var self = this;
        var cb = (arg0: string) => {
            console.log(`trigger time with for event ${this.defaultEvent} with arg0 ${arg0} and defaultEventCbCount `);
        }
        jsb.jsEventHandler.addCallback(this.defaultEvent,cb);
        console.log(`add event  for defaultEvent`);
    }

    /**
     * Use a self defined map to save references to callback
     */
    public add100Callback(){
        for(var i = 0;i<100;i++){
            this.addOneCallback();
        }
        console.log('add 100 default callback');
    }

    /**
     * Remove all callback from default event
     */
    public removeEvent() {
        jsb.jsEventHandler.removeEvent(this.defaultEvent);
        console.log(`remove 100 callback for event ${this.defaultEvent}`);
        jsb.garbageCollect();
    }

    public addNativeCallback(){
        jsb.jsEventHandler.dispatchNativeEvent("generate100Callback");
    }
    public dispatchDefaultEvent(){
        jsb.jsEventHandler.dispatchNativeEvent("dispatchJsEvent");
    }
    public removeNativeCallback(){
        jsb.jsEventHandler.dispatchNativeEvent("removeNativeCallback");
    }

    public dispatchNative(){
        jsb.jsEventHandler.dispatchNativeEvent("AutoEvent");
    }
    
}