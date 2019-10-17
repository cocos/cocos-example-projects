
let rows, cols;
rows = cols = 3;
let spacing = 2.5;

let rowSpan = rows * spacing;
let colSpan = cols * spacing;

let dif, spe, mats = [];

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

    start () {
        this.node.children.forEach(n => {
            let m = n.getComponent(cc.ModelComponent).material;
            let pos = n.getPosition();
            const props = m.getProperty('pbrParams');
            props.x = cc.math.clamp(pos.x / colSpan, 0.05, 1); // roughness
            props.y = pos.y / rowSpan; // metallic
            m.setProperty('pbrParams', props);
            mats.push(m);
        });
        // cc.loader.loadResDir('papermill/specular', cc.Texture2D, (err, asset) => {
        //     spe = new cc.TextureCube();
        //     cc.TextureCube.fromTexture2DArray(asset, spe);
        // });
        // cc.loader.loadResDir('papermill/diffuse', cc.Texture2D, (err, asset) => {
        //     dif = cc.TextureCube.fromTexture2DArray(asset);
        // });

        // cc.director.getScene().getChildByName('camera').getComponent('sky').enabled = true;
        cc.director.getScene().getChildByName('geoms-procedural').getComponent('geometries').enabled = true;
        // mats.forEach(m => {
        //     m.setProperty('diffuseEnvTexture', dif);
        //     m.setProperty('specularEnvTexture', spe);
        // });
    },
});
