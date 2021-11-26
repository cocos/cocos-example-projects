# 简介

由于之前的jsJavaBridge的调用方式比较复杂，不太好复用，故提供一种更简便的使用方法。以下是说明文档和示例。

## 接口介绍

在脚本层的接口只有两个，分别是sendToNative和onNative，分别传输和接收原生层参数。需要注意的有几点:

- 由于现在这个功能还在实验阶段，所以只支持string的传输，如果需要传输包含多种参数的对象，请考虑将其转化为Json形式进行传输并在不同层级解析。
- onNative同一时间只会记录一个函数，当再次set该属性的时候会覆盖原先的onNative方法。
- sendToScript 方法是单向通信，其不会关心下层的返回情况，也不会告知js代码操作成功或者失败。
```js
//JavaScript
export namespace bridge{
    /**
     * send to native with at least one argument.
     */
    export function sendToNative(arg0: string, arg1?: string): void;
    /**
     * save your own callback controller with a js function,
     * use jsb.bridge.onNative = (arg0: String, arg1: String | null)=>{...}
     * @param args : received from native
     */
    export function onNative(arg0: string, arg1?: string | null): void;
}
```
对应的暴露给原生层的同样为两个接口。功能对称。
```JAVA
//JAVA
public class JsbBridge {
    public interface ICallback{
        /**
         * Applies this callback to the given argument.
         *
         * @param arg0 as input
         * @param arg1 as input
         */
        void onScript(String arg0, String arg1);
    }
    /**Add a callback which you would like to apply
     * @param f ICallback, the method which will be actually applied. multiple calls will override
     * */
    public static void setCallback(ICallback f){
        JsbBridge.callback = f;
    }
    /**
     * Java dispatch Js event, use native c++ code
     * @param arg0 input values
     */
    public static void sendToScript(String arg0, String arg1);
    public static void sendToScript(String arg0){
        sendToScript(arg0, null);
    }
}
```
```objc
//Objective-c
typedef void (^ICallback)(NSString*, NSString*);
//typedef int64_t strFunc;

@interface JsbBridge : NSObject
+(instancetype)sharedInstance;
-(bool)setCallback:(ICallback)cb;
-(bool)callByScript:(NSString*)arg0 arg1:(NSString*)arg1;
-(void)sendToScript:(NSString*)arg0 arg1:(NSString*)arg1;
-(void)sendToScript:(NSString*)arg0;
@end

```
## 基本使用

### 触发Java的回调
假设我们的广告接口设置在原生层比如Java-Android广告，那么当玩家点击打开广告的按钮时，理应触发Java打开广告的操作。

我们会将打开广告的接口写成以下脚本

```JAVA
public void openAd(String adUrl){
    //Code to open ad
}
```
这时候我们需要先将打开广告的事件注册起来。
```JAVA
JsbBridge.setCallback(new JsbBridge.ICallback() {
        @Override
        public void onScript(String usrName, String url) {
            //Check usr
            //Open Ad
            openAd(url);
        }
    });
```
并且在js层脚本中对按钮的点击事件进行打开操作
```ts
public static onclick(){
    //usrName and defaultAdUrl are both string
    jsb.bridge.sendToNative(usrName, defaultAdUrl);
} 
```
这样就可以通过Jsb.Bridge这个通道将需要的信息发送到Java层进行操作了
### 触发Js的回调

假设我们的动画播放操作记录在Js层，并且希望在Java层播放这个动画，我们也可以将它注册起来。我们首先定义该函数。
```ts
public void playAnimation(animationName: string, isLoop: boolean){
    //Code to play Animation
}
```
然后在onNative中记录该方法
```ts
jsb.bridge.onNative = (animationName: string, isLoop: String | null):void=>{
    if(isLoop && isLoop == "true") {
        this.playAnimation(animationName, true);
        return;
    }
    this.playAnimation(animationName, false);
    return;
}
```
仍然以安卓项目为例，Java代码示范：
```JAVA
JsbBridge.sendToScript("SkeletonAnim001", "true");
```
就可以调用到JS的播放操作了。

## 示例工程：通过JAVA层的回调改变UI界面中不同的标签显示

由于js中onNative操作和java/objc中setCallback只能同一时间存在一份，不可避免的会有一些拘束，所以我们可以通过添加一个Map来存储我们需要的方法，来利用同一个callback做不同的事情。

在这里我们定义一个工具类，命名为方法管理器（Method Manager）来储存不同的方法。

```ts
export class MethodManager {
    private methodMap: Map<String, Function>;
    public static instance: MethodManager = new MethodManager;
    public addMethod(methodName: String, f: Function): boolean {
        if (!this.methodMap.get(methodName)) {
            this.methodMap.set(methodName, f);
            return true;
        }
        return false;
    }
    public applyMethod(methodName: String, arg?: String): boolean {
        if (!this.methodMap.get(methodName)) {
            console.log("Function not exist");
            return false;
        }
        var f = this.methodMap.get(methodName);
        try {
            f?.call(null, arg);
            return true;
        } catch (e) {
            console.log("Function trigger error: " + e);
            return false;
        }
    }
    public removeMethod(methodName: String):any{
        return this.methodMap.delete(methodName);
    }
    constructor() {
        this.methodMap = new Map<String, Function>();
        MethodManager.instance = this;
    }
}
```
接着我们将在ccclass中创建多个标签并且给定不同的属性改变函数。利用刚刚的jsb.bridge.onNative调用方法管理器的applMethod方法。

```ts
@ccclass('CallNative')
export class CallNative extends Component {
    //static eventMap: Map<string, Function> = new Map<string, Function>();    
    @property(Label)
    public labelForContent : Label|undefined;
    @property(Label)
    public labelForColor : Label|undefined;
    @property(Label)
    public labelForSize : Label|undefined;

    start () {
        new MethodManager;
        jsb.bridge.onNative = (eventname: string, arg1?: string)=>{
            console.log("Trigger event for "+eventname+"is"+MethodManager.instance.applyMethod(eventname, arg1!));
        };
        this.registerAllScriptEvent();
        this.dispatchNativeEvent();
    }
    
    public registerAllScriptEvent(){
        MethodManager.instance.addMethod("changeLabelContent", (usr : string)=>{
            this.changeLabelContent(usr);
        });
        MethodManager.instance.addMethod("changeLabelColor", (col : string)=>{
            this.changeLabelColor(col));
        });
        MethodManager.instance.addMethod("changeLabelSize", ()=>{
            this.changeLabelSize();
        });
    }
    //Method to apply for first label to change label string.
    public changeLabelContent(user: string):void {
        console.log("Hello "+ user +" I'm K");
        this.labelForContent!.string = "Hello " + user + " ! I'm K";
    }
    public changeLabelColor():void {
        this.labelForColor!.color = Color.YELLOW;
    }
    public changeLabelSize():void {
        this.labelForColor!.fontSize = 50;
    }
    
}
```

可以注意到，我们在start函数中添加了一个dispatchNativeEvent, 这个函数实际上是为了调用Native注册的函数。我们通过jsb.bridge的接口去调用它

```ts
    public dispatchNativeEvent(){
        //Call with argument and success
        jsb.bridge.sendToNative("requestLabelContent");
        jsb.bridge.sendToNative("requestLabelColor");
        jsb.bridge.sendToNative("requestLabelSize", "50");
    }
}

```

所以我们需要在原生层注册对应的callback函数，这应该是一个可以接收两个string参数的函数。并对第二个参数的有无进行判断。同理，我们声明一个HashMap来储存这些callback，并且存储一个统一的callback函数MyCallback。在AppActivity的创建时注册该函数。
```JAVA
//self defined class
public class JsbBridgeTest {
    public interface MyCallback{
        void onTrigger(String arg);
    }

    public static HashMap<String, MyCallback> myCallbackHashMap = new HashMap<>();
    private static JsbBridgeTest instance;
}
//registered in AppActivity
@Override
protected void onCreate(Bundle savedInstanceState) {
    ......
    JsbBridgeTest.myCallbackHashMap.put("requestLabelContent", arg ->{
        System.out.print("@JAVA: here is the argument transport in" + arg);
        JsbBridge.sendToScript("changeLabelContent","Charlotte");
    });
    JsbBridgeTest.myCallbackHashMap.put("requestLabelColor", arg ->{
        System.out.print("@JAVA: here is the argument transport in" + arg);
        JsbBridge.("changeLabelColor");
    });
    JsbBridgeTest.myCallbackHashMap.put("requestLabelSize", arg ->{
        System.out.print("@JAVA: here is the argument transport in" + arg);
        JsbBridge.("changeLabelSize");
    });
    
    JsbBridge.setCallback(new JsbBridge.ICallback() {
        @Override
        public void onScript(String arg0, String arg1) {
            JsbBridgeTest.myCallbackHashMap.get(arg0).onTrigger(arg1);
        }
    });
    ......
}
```

这样在Android应用初始化的时候就会将方法注册进去，并且该函数被触发时会通过JsbBridge反向执行JS的方法。

这样我们的预期效果就是在dispatchNativeEvent之后，界面上的第一行显示为Hello Charlotte, I'm K. 第二行的字体则显示为黄色。第三行的字大小为50.


