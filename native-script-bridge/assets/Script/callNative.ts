
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
    public registerAllScriptEvent() {
        jsb.jsbBridgeWrapper.addNativeEventListener("changeLabelContent", (usr: string) => {
            this.changeLabelContent(usr);
        });
        jsb.jsbBridgeWrapper.addNativeEventListener("changeLabelColor", () => {
            this.changeLabelColor();
        });
        jsb.jsbBridgeWrapper.addNativeEventListener("changeLightColor", () => {
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
        jsb.jsbBridgeWrapper.dispatchEventToNative("requestLabelContent");
    }

    //Button click event for CHANGE LABEL COLOR
    public changeLabelColorBtn() {
        jsb.jsbBridgeWrapper.dispatchEventToNative("requestLabelColor");
    }

    public changeLightColorBtn() {
        jsb.jsbBridgeWrapper.dispatchEventToNative("requestBtnColor", "50");
    }
    //Remove all listener for requestLabelColor in js, once succeed, the requestLabelColor won't work
    public disableLabelColorChange() {
        jsb.jsbBridgeWrapper.removeAllListenersForEvent("changeLabelColor");
    }
    //Remove native listener for changeLightColor, once succeed, if the changeLightColor btn is clicked, the color of box won't change.
    public disableBoxColorChange(){
        jsb.jsbBridgeWrapper.dispatchEventToNative("removeJSCallback");
    }
    public restart(){
        game.restart();
    }
    
}