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
    eventCallback requestLabelContent = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchScriptEvent:@"changeLabelContent" arg:@"Charlotte"];
    };
    eventCallback requestLabelColor = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchScriptEvent:@"changeLabelColor"];
    };
    eventCallback requestBtnColor = ^void(NSString* arg){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchScriptEvent:@"changeLightColor"];
    };
    [m addCallback:@"requestLabelContent" callback:requestLabelContent];
    [m addCallback:@"requestLabelColor" callback:requestLabelColor];
    [m addCallback:@"requestBtnColor" callback:requestBtnColor];
    [m addCallback:@"generate100Callback" callback:^void(NSString*){
        generate100Cb();
    }];
    [m addCallback:@"dispatchJsEvent" callback:^void(NSString*){
        JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
        [m dispatchScriptEvent:@"default"];
    }];
    [m addCallback:@"removeNativeCallback" callback:^(NSString *) {
        releaseCallback();
    }];
    return self;
}
static void generate100Cb(void){
    JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
    //cb is a object which will use some space to save code.
    eventCallback cb = ^void(NSString* arg){
        NSString* tmp = arg;
        NSLog(@"Trigger callback with arg %@", arg);
    };
    for(int i = 0;i<10000;i++){
        [m addCallback:@"AutoEvent" callback:cb];
    }
}
static void releaseCallback(){
    JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
    [m removeEvent:@"AutoEvent"];
}

@end
