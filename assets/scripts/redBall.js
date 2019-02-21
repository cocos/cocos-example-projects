// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    onLoad () {},

    start () {
        this.node.children.forEach(n => {
            let m = n.getComponent(cc.ModelComponent).material;
            let pos = n.getPosition();
            const props = m.getProperty('props');
            props.x = pos.y / rowSpan; // metallic
            props.y = cc.vmath.clamp(pos.x / colSpan, 0.05, 1); // roughness
            m.setProperty('props', props);
            mats.push(m);
        });
        cc.loader.loadResDir('papermill/specular', cc.Texture2D, (err, asset) => {
            spe = new cc.TextureCube();
            cc.TextureCube.fromTexture2DArray(asset, spe);
        });
        cc.loader.loadResDir('papermill/diffuse', cc.Texture2D, (err, asset) => {
            dif = cc.TextureCube.fromTexture2DArray(asset);
        });

		const keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyReleased: this._keyUpHandler.bind(this)
		});
        cc.eventManager.addListener(keyListener, 1);
    },

    updateTexture() {
        cc.director.getScene().getChildByName('camera').getComponent('sky').enabled = true;
        cc.director.getScene().getChildByName('geoms-procedural').getComponent('geometries').enabled = true;
        mats.forEach(m => {
            m.setProperty('diffuseEnvTexture', dif);
            m.setProperty('specularEnvTexture', spe);
        });
    },

	_keyUpHandler(keycode) {
		if (keycode === 'R'.charCodeAt(0) && dif && spe) this.updateTexture();
	}
});
