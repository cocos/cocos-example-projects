#include "cocos/platform/ios/IOSPlatform.h"
#include "JsbBridgeTest.h"
namespace cc{
class MyIOSPlatform : public cc::IOSPlatform {
public:
    /**
     * @brief Start base platform initialization.
     */
    int32_t run(int argc, const char** argv) override;
private:
    JsbBridgeTest* jsbBridgeTest{nullptr};
};
}
