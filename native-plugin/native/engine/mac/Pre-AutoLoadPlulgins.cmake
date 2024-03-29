# plugins found & enabled in search path


set(hello_cocos_glue_ROOT
   "${CC_PROJECT_DIR}/../../plugins/hello_cocos/mac/${CMAKE_SYSTEM_PROCESSOR}"
   "${CC_PROJECT_DIR}/../../plugins/hello_cocos/mac"
)

list(APPEND CMAKE_FIND_ROOT_PATH ${hello_cocos_glue_ROOT})
list(APPEND CC_REGISTERED_PLUGINS
  hello_cocos_glue
)

find_package(hello_cocos_glue
  NAMES "hello_cocos_glue"
  PATHS
    "${CC_PROJECT_DIR}/../../plugins/hello_cocos/mac/${CMAKE_SYSTEM_PROCESSOR}"
    "${CC_PROJECT_DIR}/../../plugins/hello_cocos/mac"
  NO_DEFAULT_PATH
)
