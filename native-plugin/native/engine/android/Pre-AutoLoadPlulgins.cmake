# plugins found & enabled in search path
# To disable automatic update of this file, set SKIP_SCAN_PLUGINS to ON.

set(hello_cocos_glue_ROOT
   "${CC_PROJECT_DIR}/../../plugins/hello_cocos/android/${ANDROID_ABI}"
   "${CC_PROJECT_DIR}/../../plugins/hello_cocos/android"
)

list(APPEND CMAKE_FIND_ROOT_PATH ${hello_cocos_glue_ROOT})
list(APPEND CC_REGISTERED_PLUGINS
  hello_cocos_glue
)

find_package(hello_cocos_glue
  REQUIRED
  NAMES "hello_cocos_glue"
# NO_DEFAULT_PATH
)
