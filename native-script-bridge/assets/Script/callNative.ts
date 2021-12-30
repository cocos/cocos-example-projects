
import { _decorator, Component, Node, Label, color, Color, MeshRenderer, Canvas, UITransform, Light, View, Game, game } from 'cc';
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
    update(){
        jsb.garbageCollect();
    }
    public registerAllScriptEvent() {
        jsb.jsbBridgeWrapper.addCallback("changeLabelContent", (usr: string) => {
            this.changeLabelContent(usr);
        });
        jsb.jsbBridgeWrapper.addCallback("changeLabelColor", () => {
            this.changeLabelColor();
        });
        jsb.jsbBridgeWrapper.addCallback("changeLightColor", () => {
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
        jsb.jsbBridgeWrapper.dispatchNativeEvent("requestLabelContent");
    }

    //Button click event for CHANGE LABEL COLOR
    public changeLabelColorBtn() {
        jsb.jsbBridgeWrapper.dispatchNativeEvent("requestLabelColor");
    }

    public changeLightColorBtn() {
        jsb.jsbBridgeWrapper.dispatchNativeEvent("requestBtnColor", "50");
    }

    private defaultEvent = "default";
    private addOneCallback() {
        var self = this;
        var cb = (arg0: string) => {
            console.log(`trigger time with for event ${this.defaultEvent} with arg0 ${arg0} and defaultEventCbCount `);
        }
        jsb.jsbBridgeWrapper.addCallback(this.defaultEvent,cb);
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
        jsb.jsbBridgeWrapper.removeEvent(this.defaultEvent);
        console.log(`remove 100 callback for event ${this.defaultEvent}`);
        jsb.garbageCollect();
    }

    public addNativeCallback(){
        jsb.jsbBridgeWrapper.dispatchNativeEvent("generate100Callback");
    }
    public dispatchDefaultEvent(){
        jsb.jsbBridgeWrapper.dispatchNativeEvent("dispatchJsEvent");
    }
    public removeNativeCallback(){
        jsb.jsbBridgeWrapper.dispatchNativeEvent("removeNativeCallback");
        jsb.garbageCollect();
    }

    public dispatchNative(){
        jsb.jsbBridgeWrapper.dispatchNativeEvent("AutoEvent");
    }
    public restart(){
        game.restart();
    }
    
}