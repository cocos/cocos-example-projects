
import { _decorator, Component, Node, Label, color, Color, MeshRenderer, Canvas, UITransform, Light, View, jsEventHandler, JsEventHandler, Game } from 'cc';
import { CC_LOG_DEBUG, MethodManager } from './MethodManager';
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
        CC_LOG_DEBUG("Hello " + user + " I'm K");
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
        jsb.jsEventHandler.sendToNative("requestLabelContent");
    }

    //Button click event for CHANGE LABEL COLOR
    public changeLabelColorBtn() {
        jsb.jsEventHandler.sendToNative("requestLabelColor");
    }

    public changeLightColorBtn() {
        jsb.jsEventHandler.sendToNative("requestBtnColor", "50");
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
    private eventId = 0;
    public add100Callback() {
        var self = this;
        for (var i = 0; i < 100; i++) {
            jsb.jsEventHandler.addCallback(self.eventId.toString(), (arg0: string) => {
                console.log(`add one hundred for event ${self.eventId} with callback id ${i}`);
            })
        }
        this.eventId++;
    }

    public removeOneCallback() {
        var self = this;
        jsb.jsEventHandler.removeCallback(this.defaultEvent,this.myCbList[0]);

    }


}