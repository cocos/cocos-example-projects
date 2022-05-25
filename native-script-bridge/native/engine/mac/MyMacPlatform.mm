#include "MyMacPlatform.h"
#include "platform/mac/AppDelegate.h"

namespace cc{

int32_t MyMacPlatform::run(int argc, const char** argv) {
    id delegate = [[AppDelegate alloc] init];
    NSApplication.sharedApplication.delegate = delegate;
    jsbBridgeTest = [JsbBridgeTest new];
    return NSApplicationMain(argc, argv);
}
}//namespace cc
