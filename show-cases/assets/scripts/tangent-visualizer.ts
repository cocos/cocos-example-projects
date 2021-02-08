import { _decorator, Color, Component, Material, ModelComponent, utils, Vec3, GFXPrimitiveMode, GFXAttributeName } from 'cc';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

const v3_1 = new Vec3();
const v3_2 = new Vec3();

@ccclass('TangentVisualizer')
@requireComponent(ModelComponent)
@executeInEditMode
export class TangentVisualizer extends Component {

    @property(ModelComponent)
    public target = null;

    @property
    public scale = 0.1;

    public _material = new Material();

    @property
    set apply (val) {
        this.refresh();
    }
    get apply () {
        return false;
    }

    public start () {
        this._material.initialize({
            effectName: 'builtin-unlit',
            defines: { USE_VERTEX_COLOR: true },
            states: { primitive: GFXPrimitiveMode.LINE_LIST },
        });
        this.refresh();
    }

    public refresh () {
        if (!this.target) { return; }
        const comps = this.node.getComponents(ModelComponent);
        if (comps.length < 3) { console.warn('three model component on this node is needed'); return; }
        const position: TypedArray = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_POSITION);
        const normal: TypedArray = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_NORMAL);
        const tangent: TypedArray = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_TANGENT);
        const bitangent: TypedArray = this._generateBitangent(normal, tangent);
        this._updateModel(comps[0], position, normal, Color.MAGENTA);
        this._updateModel(comps[1], position, tangent, Color.CYAN, 4);
        this._updateModel(comps[2], position, bitangent, Color.YELLOW);
    }

    public _updateModel (comp: ModelComponent, pos: TypedArray, data: TypedArray, color: Color, stride = 3) {
        comp.material = this._material;
        comp.mesh = utils.createMesh({
            positions: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
                const ofs = Math.floor(i / 2);
                Vec3.fromArray(v3_1, pos, ofs * 3);
                if (i % 2) { Vec3.scaleAndAdd(v3_1, v3_1, Vec3.fromArray(v3_2, data, ofs * stride), this.scale); }
                return Vec3.toArray([], v3_1);
            }).reduce((acc, cur) => (cur.forEach((c) => acc.push(c)), acc), []),
            colors: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
                return Color.toArray([], i % 2 ? color : Color.WHITE);
            }).reduce((acc, cur) => (cur.forEach((c) => acc.push(c)), acc), []),
            primitiveMode: GFXPrimitiveMode.LINE_LIST,
            minPos: new Vec3(-Infinity, -Infinity, -Infinity),
            maxPos: new Vec3( Infinity,  Infinity,  Infinity),
        });
    }

    public _generateBitangent (normal: TypedArray, tangent: TypedArray) {
        const bitangent = normal.slice();
        const vCount = normal.length / 3;
        for (let i = 0; i < vCount; i++) {
            Vec3.fromArray(v3_1, normal, i * 3);
            Vec3.fromArray(v3_2, tangent, i * 4);
            Vec3.multiplyScalar(v3_1, Vec3.cross(v3_1, v3_1, v3_2), tangent[i * 4 + 3]);
            Vec3.toArray(bitangent, v3_1, i * 3);
        }
        return bitangent;
    }
}
