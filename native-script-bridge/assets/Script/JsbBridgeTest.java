//Script to add into com.cocos.game package, backup here
package com.cocos.game;

import com.cocos.lib.JsbBridge;
import java.util.HashMap;

public class JsbBridgeTest {
    public interface MyCallback{
        void onTrigger(String arg);
    }
    public static void start(){
        JsbBridgeTest.myCallbackHashMap.put("requestLabelContent", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelContent","Charlotte");
        });
        JsbBridgeTest.myCallbackHashMap.put("requestLabelColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLabelColor");
        });
        JsbBridgeTest.myCallbackHashMap.put("requestBtnColor", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);
            JsbBridge.sendToScript("changeLightColor");
        });

        JsbBridge.setCallback(new JsbBridge.ICallback() {
            @Override
            public void onScript(String arg0, String arg1) {
                JsbBridgeTest.myCallbackHashMap.get(arg0).onTrigger(arg1);
            }
        });
    }
    public static HashMap<String, MyCallback> myCallbackHashMap = new HashMap<>();
    private static JsbBridgeTest instance;
}
