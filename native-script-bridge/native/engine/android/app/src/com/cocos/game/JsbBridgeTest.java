//Script to add into com.cocos.game package, backup here
package com.cocos.game;
import com.cocos.lib.JsbBridgeWrapper;

public class JsbBridgeTest {
    public static void start(){
        //Original method
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.addScriptEventListener("requestLabelContent", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            jbw.dispatchEventToScript("changeLabelContent","Charlotte");
        });
        jbw.addScriptEventListener("requestLabelColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            jbw.dispatchEventToScript("changeLabelColor");
        });
        jbw.addScriptEventListener("requestBtnColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            jbw.dispatchEventToScript("changeLightColor");
        });

        //Only use JavaEventHandler
        jbw.addScriptEventListener("removeJSCallback", arg->{
            jbw.removeAllListenersForEvent("requestBtnColor");
        });

    }
}
