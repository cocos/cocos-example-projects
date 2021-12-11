#include <iostream>
#include <string>
#include "JsbBridgeTest.h"
#import <Foundation/Foundation.h>
#include "cocos/platform/apple/JsbBridge.h"
@implementation JsbBridgeTest{
    NSMutableDictionary<NSString*, eventCallback> *cbDictionnary;
    
}
static JsbBridgeTest* instance = nil;
static ICallback cb = ^void (NSString* _arg0, NSString* _arg1){
    [[JsbBridgeTest sharedInstance] applyMethod:_arg0 arg1:_arg1];
};
+(instancetype)sharedInstance{
    static dispatch_once_t pred = 0;
    dispatch_once(&pred, ^{
        instance = [[super allocWithZone:NULL]init];
    });
    return instance;
}

+(id)allocWithZone:(struct _NSZone *)zone{
    return [JsbBridgeTest sharedInstance];
}

-(id)copyWithZone:(struct _NSZone *)zone{
    return [JsbBridgeTest sharedInstance];
}

-(void)addMethod:(NSString*)arg0 callback:(eventCallback)callback {
    [cbDictionnary setValue:callback forKey:arg0];
}
-(void)applyMethod:(NSString*)name arg1:(NSString*)arg1 {
    [cbDictionnary objectForKey:name](arg1);
}
-(id)init{
    self = [super init];
    cbDictionnary = [NSMutableDictionary new];
    eventCallback requestLabelContent = ^void(NSString* arg){
        JsbBridge* m = [JsbBridge sharedInstance];
        [m sendToScript:@"changeLabelContent" arg1:@"Charlotte"];
    };
    eventCallback requestLabelColor = ^void(NSString* arg){
        JsbBridge* m = [JsbBridge sharedInstance];
        [m sendToScript:@"changeLabelColor"];
    };
    eventCallback requestBtnColor = ^void(NSString* arg){
        JsbBridge* m = [JsbBridge sharedInstance];
        [m sendToScript:@"changeLightColor"];
    };
    
    [self addMethod:@"requestLabelContent" callback:requestLabelContent];
    [self addMethod:@"requestLabelColor" callback:requestLabelColor];
    [self addMethod:@"requestBtnColor" callback:requestBtnColor];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m setCallback:cb];
    return self;
}

@end
