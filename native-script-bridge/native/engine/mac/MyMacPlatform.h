#include "cocos/platform/mac/MacPlatform.h"
#include "JsbBridgeTest.h"
namespace cc{
class MyMacPlatform : public cc::MacPlatform {
public:
    /**
     * @brief Start base platform initialization.
     */
    int32_t run(int argc, const char** argv) override;
private:
    JsbBridgeTest* jsbBridgeTest{nullptr};
};
}
