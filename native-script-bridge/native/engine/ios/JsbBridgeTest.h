
#ifndef Header_h
#define Header_h
#import <Foundation/Foundation.h>

typedef void(^eventCallback)(NSString*);

@interface JsbBridgeTest:NSObject
+(instancetype)sharedInstance;
-(void)addMethod:(NSString*)arg0 callback:(eventCallback)callback;
-(void)applyMethod:(NSString*)name arg1:(NSString*)arg1;
@end


#endif /* Header_h */
