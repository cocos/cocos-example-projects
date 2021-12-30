package com.cocos.game;

import com.cocos.lib.JsbBridgeWrapper;

public class AutoGenerator {
    //Auto generate a java callback and register into javaEventHandler
    public static void generateJavaCallback(){
        JsbBridgeWrapper.JavaCallback cb = new JsbBridgeWrapper.JavaCallback() {
            @Override
            public void onTrigger(String arg) {
                System.out.print("Trigger Event");
            }
        };
        JsbBridgeWrapper.getInstance().addCallback("AutoEvent", cb);
    }
    public static void generate100Callback(){
        for (int i = 0; i< 100;i++)
            generateJavaCallback();
    }
    public static void releaseCallback(){
        JsbBridgeWrapper.getInstance().removeEvent("AutoEvent");
    }
}
