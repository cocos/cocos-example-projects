// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let rows = 7;
let cols = 7;
let spacing = 2.5;

let rowSpan = rows * spacing;
let colSpan = cols * spacing;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        let m = this.getComponent(cc.ModelComponent).material;
        let pos = this.node.getPosition();
        m.setProperty('metallic', pos.y / rowSpan);
        m.setProperty('roughness', cc.vmath.clamp(pos.x / colSpan, 0.05, 1));
        cc.loader.loadResDir('textures/papermill/specular', cc.Texture2D, (err, asset) => {
            let texture = cc.TextureCube.fromTexture2DArray(asset);
            m.setProperty('specularEnvTexture', texture);
        });
        // to be removed after texture cube integration
        m.define('USE_IBL', true);
        cc.loader.loadResDir('textures/papermill/diffuse', cc.Texture2D, (err, asset) => {
            let texture = cc.TextureCube.fromTexture2DArray(asset);
            m.setProperty('diffuseEnvTexture', texture);
        });
    },

    // update (dt) {},
});
