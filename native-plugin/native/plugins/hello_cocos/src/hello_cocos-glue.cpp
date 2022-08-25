
#include "hello_cocos.h"
#include "bindings/sebind/sebind.h"
#include "plugins/bus/EventBus.h"
#include "plugins/Plugins.h"


// export c++ methods to JS
static bool register_demo(se::Object *ns) {

  sebind::class_<Demo> klass("Demo");

  klass.constructor<const char *>()
      .function("hello", &Demo::hello);
  klass.install(ns);
  return true;
}

void add_demo_class() {
  using namespace cc::plugin;
  static Listener listener(BusType::SCRIPT_ENGINE);
  listener.receive([](ScriptEngineEvent event) {
    if (event == ScriptEngineEvent::POST_INIT) {
      se::ScriptEngine::getInstance()->addRegisterCallback(register_demo);
    }
  });
}

/**
 * Regist a new cc plugin entry function
 * first  param: should match the name in cc_plugin.json
 * second param: callback when engine initialized
 */ 
CC_PLUGIN_ENTRY(hello_cocos_glue, add_demo_class);
