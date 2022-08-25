System.register("chunks:///_virtual/HelloNative.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, Color;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;

      cclegacy._RF.push({}, "31940XRVBRHvYSgsvpKNa52", "HelloNative", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let HelloNative = exports('HelloNative', (_dec = ccclass('HelloNative'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = class HelloNative extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "stateLabel", _descriptor, this);

          _initializerDefineProperty(this, "resultLabel", _descriptor2, this);
        }

        start() {
          {
            if (typeof Demo === 'undefined') {
              this.failTest("FAILED: class is not exported, native plugin not enabled?", "[empty]");
            } else {
              const d = new Demo("Cocos");
              this.stateLabel.string = "SUCCESS: see message⬆";
              this.resultLabel.string = d.hello("World");
            }
          }
        }

        failTest(state, error) {
          this.stateLabel.string = state;
          this.resultLabel.string = error;
          this.stateLabel.color = Color.RED;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stateLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "resultLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./HelloNative.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
//# sourceMappingURL=index.js.map