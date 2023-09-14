#include "MyMacPlatform.h"
#include "platform/mac/AppDelegate.h"

namespace cc{

int32_t MyMacPlatform::run(int argc, const char** argv) {
    jsbBridgeTest = [JsbBridgeTest new];
    return MacPlatform::run(argc, argv);
}
}//namespace cc
