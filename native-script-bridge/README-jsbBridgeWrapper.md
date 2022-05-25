# 简介

`JsbBridgeWrapper`是封装在`JsbBridge`之上的事件派发机制，相对于`JsbBridge`而言它更方便易用。开发者不需要手动去实现一套消息收发机制就可以进行多事件的触发。但它是建立在原本的例子的实现之上的，所以不具有多线程稳定性或者是100%安全。如果遇到复杂需求场景，仍然建议自己实现对应的事件派发。

## JsbBridgeWrapper接口介绍

如同之前的jsb-bridge，它的接口被声明在jsb.d.ts文件中，它的用法更符合直觉，并且名称也很方便理解。

```js
    /**
     * Listener for jsbBridgeWrapper's event.
     * It takes one argument as string which is transferred by jsbBridge.
     */
    export type OnNativeEventListener = (arg: string) => void;
    export namespace jsbBridgeWrapper {
        /** If there's no event registered, the wrapper will create one  */
        export function addNativeEventListener(eventName: string, listener: OnNativeEventListener);
        /**
         * Dispatch the event registered on Objective-C, Java etc.
         * No return value in JS to tell you if it works.
         */
        export function dispatchEventToNative(eventName: string, arg?: string);
        /**
         * Remove all listeners relative.
         */
        export function removeAllListenersForEvent(eventName: string);
        /**
         * Remove the listener specified
         */
        export function removeNativeEventListener(eventName: string, listener: OnNativeEventListener);
        /**
         * Remove all events, use it carefully!
         */
        export function removeAllListeners();
    }
```

`OnNativeEventListener`是实际注册的callback类型，为了防止因为类型不匹配导致的低级错误，使用显示声明该类型。`addNativeEventListener`中的第二个参数即为传入的callback。当然也可以使用匿名函数代替。举个例子：

```js
    //When A is triggered, this.A will be applied
    jsb.jsbBridgeWrapper.addNativeEventListener("A", (usr: string) => {
            this.A(usr);
    });
```

PS：这里是为了防止this指向不明确，所以使用匿名函数封装一层作用域。

同样的对应Objective-C和Java端，`JsbBridgeWrapper`有着类似的函数名称。

```objc
//In Objective-C
typedef void (^OnScriptEventListener)(NSString*);

@interface JsbBridgeWrapper : NSObject
/**
 * Get the instance of JsbBridgetWrapper
 */
+ (instancetype)sharedInstance;
/**
 * Add a listener to specified event, if the event does not exist, the wrapper will create one. Concurrent listener will be ignored
 */
- (void)addScriptEventListener:(NSString*)eventName listener:(OnScriptEventListener)listener;
/**
 * Remove listener for specified event, concurrent event will be deleted. Return false only if the event does not exist
 */
- (bool)removeScriptEventListener:(NSString*)eventName listener:(OnScriptEventListener)listener;
/**
 * Remove all listener for event specified.
 */
- (void)removeAllListenersForEvent:(NSString*)eventName;
/**
 * Remove all event registered. Use it carefully!
 */
- (void)removeAllListeners;
/**
 * Dispatch the event with argument, the event should be registered in javascript, or other script language in future.
 */
- (void)dispatchEventToScript:(NSString*)eventName arg:(NSString*)arg;
/**
 * Dispatch the event which is registered in javascript, or other script language in future.
 */
- (void)dispatchEventToScript:(NSString*)eventName;
@end

```

```JAVA
//In JAVA
public class JsbBridgeWrapper {
    public interface OnScriptEventListener {
        void onScriptEvent(String arg);
    }
    /**
     * Add a listener to specified event, if the event does not exist, the wrapper will create one. Concurrent listener will be ignored
     */
    public void addScriptEventListener(String eventName, OnScriptEventListener listener);
    /**
     * Remove listener for specified event, concurrent event will be deleted. Return false only if the event does not exist
     */
    public boolean removeScriptEventListener(String eventName, OnScriptEventListener listener);
    /**
     * Remove all listener for event specified.
     */
    public void removeAllListenersForEvent(String eventName);
    /**
     * Remove all event registered. Use it carefully!
     */
    public void removeAllListeners() {
        this.eventMap.clear();
    }
    /**
     * Dispatch the event with argument, the event should be registered in javascript, or other script language in future.
     */
    public void dispatchEventToScript(String eventName, String arg);
    /**
     * Dispatch the event which is registered in javascript, or other script language in future.
     */
    public void dispatchEventToScript(String eventName);
}
```

## 基础使用

### 注册JS事件并在原生层触发事件

我们依然从最直接的需求入手：通过原生的回调结果改变label内容，当原生层的事件被触发时，将目标文本字符回传给js层。JS层需要首先注册一个`changeLabelContent`事件触发的callback。

```js
    jsb.jsbBridgeWrapper.addNativeEventListener("changeLabelContent", (usr: string) => {
            this.changeLabelContent(usr);
    });
    public changeLabelContent(user: string): void {
        console.log("Hello " + user + " I'm K");
        this.labelForContent!.string = "Hello " + user + " ! I'm K";
    }
```

当js层的`changeLabelContent`事件被触发时，标签的内容会变成对应的字符串组合。此时我们再处理原生的事件注册。

```Objc
    //Objective-C
    JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
    OnScriptEventListener requestLabelContent = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchEventToScript:@"changeLabelContent" arg:@"Charlotte"];
    };
    [m addScriptEventListener:@"requestLabelContent" listener:requestLabelContent];
```

```JAVA
    //JAVA
    JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
    jbw.addScriptEventListener("requestLabelContent", arg ->{
        System.out.print("@JAVA: here is the argument transport in" + arg);
        jbw.dispatchEventToScript("changeLabelContent","Charlotte");
    });
```

PS: `JAVA`可以通过匿名函数的方法来实现interface的需求，此处写法简化。

这里原生的返回值被设置成固定字符，但开发者可以根据需求实现异步亦或是延后的字符赋值，时机并非固定。简而言之，当原生收到`requestLabelContent`的事件时，原生将会反过来触发js层的`changeLabelContent`的事件，并将字符作为事件触发的传参。

最后一步，我们在场景中添加一个按钮和对应的事件。

```js
    //Button click event for SAY HELLO
    public sayHelloBtn() {
        jsb.jsbBridgeWrapper.dispatchEventToNative("requestLabelContent");
    }
```

最终的效果和JsbBridge的测试例效果相同。点击`SAY HELLO`按钮，第一行的内容会改变为打过招呼的信息，否则即为失败。

![picture 2](images/8e25224831664b67dfa8b72221e40d4bcc125975aa80091c159237a05f53baa7.png)  

可以看到使用`JsbBridgeWrapper`模块时，开发者不需要自己去维护多余的机制，只需要关心是否正确注册和取消注册即可。