# plugins found & enabled in search path


set(aes_glue_ROOT
   "${CC_PROJECT_DIR}/../../plugins/aes/ios"
)

list(APPEND CMAKE_FIND_ROOT_PATH ${aes_glue_ROOT})
list(APPEND CC_REGISTERED_PLUGINS
  aes_glue
)

find_package(aes_glue
  NAMES "aes_glue"
  PATHS
    "${CC_PROJECT_DIR}/../../plugins/aes/ios"
  NO_DEFAULT_PATH
)
