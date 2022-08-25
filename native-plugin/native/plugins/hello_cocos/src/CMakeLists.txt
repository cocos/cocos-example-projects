

set(_HELLO_COCOS_GLUE_SRC_DIR ${CMAKE_CURRENT_LIST_DIR})

add_library(hello_cocos_glue ${_HELLO_COCOS_GLUE_SRC_DIR}/hello_cocos-glue.cpp)

target_link_libraries(hello_cocos_glue
    hello_cocos
    ${ENGINE_NAME} # cocos_engine
)

target_include_directories(hello_cocos_glue PRIVATE
    ${_HELLO_COCOS_GLUE_SRC_DIR}/../include
)