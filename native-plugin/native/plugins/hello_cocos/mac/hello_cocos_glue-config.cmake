set(_HELLO_COCOS_GLUE_SRC_DIR ${CMAKE_CURRENT_LIST_DIR})


add_library(hello_cocos STATIC IMPORTED GLOBAL)
set_target_properties(hello_cocos PROPERTIES
    IMPORTED_LOCATION ${_HELLO_COCOS_GLUE_SRC_DIR}/lib/libhello_cocos.a
)

include(${_HELLO_COCOS_GLUE_SRC_DIR}/../src/CMakeLists.txt)
