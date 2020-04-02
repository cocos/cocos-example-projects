import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Geometries')
export class Geometries extends Component {

    public start () {
        this.node.removeAllChildren();
        const models = [];
        const rows = 7; const cols = 7; const stride = 2.5;
        const albedo = cc.color(128, 0, 0);
        const meshSphere = cc.utils.createMesh(cc.primitives.sphere(1, { segments: 64 }));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const node = new cc.Node();
                node.parent = this.node;
                node.setPosition((j - Math.floor(cols / 2)) * stride, (i - Math.floor(rows / 2)) * stride, 0);
                const comp = node.addComponent(cc.ModelComponent);
                comp.mesh = meshSphere;
                const m = new cc.Material();
                m.initialize({
                    effectName: 'builtin-standard',
                });
                m.setProperty('roughness', cc.math.clamp(j / cols, 0.05, 1));
                m.setProperty('metallic', i / rows);
                m.setProperty('albedo', albedo);
                comp.material = m; models.push(comp);
            }
        }
    }
}
