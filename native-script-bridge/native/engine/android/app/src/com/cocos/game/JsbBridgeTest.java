//Script to add into com.cocos.game package, backup here
package com.cocos.game;

import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.lib.JsbBridge;

public class JsbBridgeTest {
    public static void start(){
        //Original method
        JsbBridgeWrapper.getInstance().addCallback("requestLabelContent", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelContent","Charlotte");
        });
        JsbBridgeWrapper.getInstance().addCallback("requestLabelColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelColor");
        });
        JsbBridgeWrapper.getInstance().addCallback("requestBtnColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLightColor");
        });

        //Only use JavaEventHandler
        JsbBridgeWrapper.getInstance().addCallback("generate100Callback", arg->{
            AutoGenerator.generate100Callback();
        });
        JsbBridgeWrapper.getInstance().addCallback("dispatchJsEvent", arg->{
            JsbBridgeWrapper.getInstance().dispatchScriptEvent("default");
        });
        JsbBridgeWrapper.getInstance().addCallback("removeNativeCallback", arg->{
            AutoGenerator.releaseCallback();
        });

    }
}
