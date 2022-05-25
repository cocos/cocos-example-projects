#include <iostream>
#include <string>
#include "JsbBridgeTest.h"
#import <Foundation/Foundation.h>
#import "cocos/platform/apple/JsbBridgeWrapper.h"
@implementation JsbBridgeTest{
}

-(id)init{
    self = [super init];
    JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
    OnScriptEventListener requestLabelContent = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchEventToScript:@"changeLabelContent" arg:@"Charlotte"];
    };
    OnScriptEventListener requestLabelColor = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchEventToScript:@"changeLabelColor"];
    };
    OnScriptEventListener requestBtnColor = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchEventToScript:@"changeLightColor"];
    };
    [m addScriptEventListener:@"requestLabelContent" listener:requestLabelContent];
    [m addScriptEventListener:@"requestLabelColor" listener:requestLabelColor];
    [m addScriptEventListener:@"requestBtnColor" listener:requestBtnColor];
    
    [m addScriptEventListener:@"removeJSCallback" listener:^void(NSString* arg){
        JsbBridgeWrapper * m = [JsbBridgeWrapper sharedInstance];
        [m removeAllListenersForEvent:@"requestBtnColor"];
    }];
    return self;
}


@end
