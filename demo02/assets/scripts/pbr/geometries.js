// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start () {
        let models = [];
        let rows = 7, cols = 7, stride = 2.5;
        let albedo = cc.color(128, 0, 0);
        let meshSphere = cc.utils.createMesh(cc.primitives.sphere(1, { segments: 64 }));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let node = new cc.Node();
                node.parent = this.node;
                node.setPosition((j-cols/2)*stride, (i-rows/2)*stride, -2);
                let comp = node.addComponent(cc.ModelComponent);
                comp.mesh = meshSphere;
                let m = new cc.Material();
                m.initialize({
                    effectName: 'builtin-standard',
                });
                m.setProperty('pbrParams', cc.v4(cc.math.clamp(j / cols, 0.05, 1), i / rows, 1, 7));
                m.setProperty('albedo', albedo);
                comp.material = m; models.push(comp);
            }
        }
        // cc.loader.loadRes('brdfLUT/brdfLUT', cc.Texture2D, 'internal', null, (err, asset) => {
        //     models.forEach(m => m.material.setProperty('brdfLUT', asset));
        // });
        // cc.loader.loadResDir('papermill/diffuse', cc.Texture2D, (err, asset) => {
        //     let texture = cc.TextureCube.fromTexture2DArray(asset);
        //     models.forEach(m => m.material.setProperty('diffuseEnvTexture', texture));
        // });
        // cc.loader.loadResDir('papermill/specular', cc.Texture2D, (err, asset) => {
        //     let texture = cc.TextureCube.fromTexture2DArray(asset);
        //     models.forEach(m => m.material.setProperty('specularEnvTexture', texture));
        // });
    },

    // update (dt) {},
});
