cmake_minimum_required(VERSION 3.8)

set(CMAKE_SYSTEM_NAME iOS)
set(APP_NAME "CXJ"  CACHE STRING "Project Name")

project(${APP_NAME} CXX)

set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_UI_RESOURCES)
set(CC_PROJ_SOURCES)
set(CC_ASSET_FILES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)

include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
set(EXECUTABLE_NAME ${APP_NAME}-mobile)

set(JSB_BRIDGE_TEST_SOURCE
    ${CMAKE_CURRENT_LIST_DIR}/JsbBridgeTest.h
    ${CMAKE_CURRENT_LIST_DIR}/JsbBridgeTest.mm
    ${CMAKE_CURRENT_LIST_DIR}/MyIOSPlatform.h
    ${CMAKE_CURRENT_LIST_DIR}/MyIOSPlatform.mm
    ${CMAKE_}
)
list(APPEND CC_PROJ_SOURCES
    ${JSB_BRIDGE_TEST_SOURCE}
)

cc_ios_before_target(${EXECUTABLE_NAME})
add_executable(${EXECUTABLE_NAME} ${CC_ALL_SOURCES})
cc_ios_after_target(${EXECUTABLE_NAME})
