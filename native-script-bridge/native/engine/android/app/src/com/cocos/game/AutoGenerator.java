package com.cocos.game;

import com.cocos.lib.JavaEventHandler;

public class AutoGenerator {
    //Auto generate a java callback and register into javaEventHandler
    public static void generateJavaCallback(){
        JavaEventHandler.javaCallback cb = new JavaEventHandler.javaCallback() {
            @Override
            public void onTrigger(String arg) {
                System.out.print("Trigger Event");
            }
        };
        JavaEventHandler.getInstance().addCallback("AutoEvent", cb);
    }
    public static void generate100Callback(){
        for (int i = 0; i< 100;i++)
            generateJavaCallback();
    }
    public static void releaseCallback(){
        JavaEventHandler.getInstance().removeEvent("AutoEvent");
    }
}
