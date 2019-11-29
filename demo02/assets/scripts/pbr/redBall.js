import { _decorator, Component, ModelComponent } from "cc";
const { ccclass } = _decorator;

let rows, cols;
rows = cols = 3;
let spacing = 2.5;

let rowSpan = rows * spacing;
let colSpan = cols * spacing;

let dif, spe, mats = [];

@ccclass("RedBall")
export class RedBall extends Component {

    start () {
        this.node.children.forEach(n => {
            let pos = n.position;
            let m = n.getComponent(ModelComponent).material;
            m.setProperty('roughness', cc.math.clamp(pos.x / colSpan, 0.05, 1));
            m.setProperty('metallic', pos.y / rowSpan);
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
        cc.director.getScene().getChildByName('geoms-procedural').getComponent('Geometries').enabled = true;
        // mats.forEach(m => {
        //     m.setProperty('diffuseEnvTexture', dif);
        //     m.setProperty('specularEnvTexture', spe);
        // });
    }
}
