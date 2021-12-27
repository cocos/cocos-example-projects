//Script to add into com.cocos.game package, backup here
package com.cocos.game;

import com.cocos.lib.JavaEventHandler;
import com.cocos.lib.JsbBridge;

public class JsbBridgeTest {
    public static void start(){
        //Original method
        JavaEventHandler.getInstance().addCallback("requestLabelContent", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelContent","Charlotte");
        });
        JavaEventHandler.getInstance().addCallback("requestLabelColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelColor");
        });
        JavaEventHandler.getInstance().addCallback("requestBtnColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLightColor");
        });

        //Only use JavaEventHandler
        JavaEventHandler.getInstance().addCallback("generate100Callback", arg->{
            AutoGenerator.generate100Callback();
        });
        JavaEventHandler.getInstance().addCallback("dispatchJsEvent", arg->{
            JavaEventHandler.getInstance().dispatchScriptEvent("default");
        });
        JavaEventHandler.getInstance().addCallback("removeNativeCallback", arg->{
            AutoGenerator.releaseCallback();
        });

    }
}
