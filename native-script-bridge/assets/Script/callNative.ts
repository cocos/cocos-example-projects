
import { _decorator, Component, Node, Label, color, Color, MeshRenderer, Canvas, UITransform, Light } from 'cc';
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
        new MethodManager;
        jsb.bridge.onNative = (methodName: string, arg1?: string | null) => {
            CC_LOG_DEBUG("Trigger event for " + methodName + " is " + MethodManager.instance.applyMethod(methodName, arg1!));
        };
        this.registerAllScriptEvent();
    }

    public registerAllScriptEvent() {
        MethodManager.instance.addMethod("changeLabelContent", (usr: string) => {
            this.changeLabelContent(usr);
        });
        MethodManager.instance.addMethod("changeLabelColor", () => {
            this.changeLabelColor();
        });
        MethodManager.instance.addMethod("changeLightColor", () => {
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
    public sayHelloBtn(){
        jsb.bridge.sendToNative("requestLabelContent");
    }

    //Button click event for CHANGE LABEL COLOR
    public changeLabelColorBtn(){
        jsb.bridge.sendToNative("requestLabelColor");
    }

    public changeLightColorBtn(){
        jsb.bridge.sendToNative("requestBtnColor", "50");
    }
}