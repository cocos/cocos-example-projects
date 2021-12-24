//Script to add into com.cocos.game package, backup here
package com.cocos.game;

import com.cocos.lib.JsJavaEventHandler;
import com.cocos.lib.JsbBridge;
import java.util.HashMap;

public class JsbBridgeTest {
    public static void start(){
        JsJavaEventHandler.getInstance().addCallback("requestLabelContent", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelContent","Charlotte");
        });
        JsJavaEventHandler.getInstance().addCallback("requestLabelColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelColor");
        });
        JsJavaEventHandler.getInstance().addCallback("requestBtnColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLightColor");
        });
    }
}
