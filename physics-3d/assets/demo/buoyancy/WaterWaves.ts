import { _decorator, Component, Node, MeshRenderer, Mesh, gfx, Material, Primitive, Vec3, Color, director, sys, Mat4, Vec2, utils, primitives, game } from 'cc';
import Noise from '../../common/scripts/Noise';
const { ccclass, property, menu } = _decorator;

const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v3_arr: Vec3[] = [new Vec3(), new Vec3(), new Vec3()];
const mat4_0 = new Mat4();

@ccclass('BUOYANCY.WaterWaves')
@menu("demo/buoyancy/WaterWaves")
export class WaterWaves extends Component {

    @property
    private density = 1;
    get Density() { return this.density; }

    @property
    private speed = 1;

    @property
    private height = 0.2;

    @property
    private noiseWalk = 0.5;

    @property
    private noiseStrength = 0.1;

    // @property(Mesh)
    // mesh: Mesh = null!;

    // @property(Material)
    // material: Material = null!;

    @property
    rows = 10;

    @property
    columns = 10;

    @property
    tileSize = 1;

    @property
    bottom = -10;

    public static instance: WaterWaves;

    private _mesh: Mesh = null!;
    private _meshRenderer: MeshRenderer = null!;
    private _indices: Uint16Array = null!;
    private _positions: Float32Array = null!;
    private _basePositions: Float32Array = null!;
    private _worldPositions: Float32Array = null!;
    private _normals: Float32Array = null!;
    private _faceLength = 0;
    private _vertexLength = 0;
    private _meshDirty = false;
    private _offsetX = 0;
    private _offsetZ = 0;

    @property
    debugPosition = false;

    @property
    debugHeight = false;

    get DebugMeshBox(): Mesh {
        if (this._debugMeshBox == null) {
            this._debugMeshBox = new Primitive(Primitive.PrimitiveType.BOX);
            this._debugMeshBox.onLoaded();
        }
        return this._debugMeshBox;
    }

    get DebugMeshLine(): Mesh {
        if (this._debugMeshLine == null) {
            const geo: primitives.IGeometry = {
                'positions': [0, 0, 0, 1, 1, 1, 0, 0, 1],
                'indices': [0, 1, 0, 2, 1, 2],
                'primitiveMode': gfx.PrimitiveMode.LINE_LIST,
            };
            this._debugMeshLine = utils.createMesh(geo);
            this._debugMeshLine.onLoaded();
        }
        return this._debugMeshLine;
    }

    get DebugMatPos(): Material {
        if (this._debugMatPosition == null) {
            this._debugMatPosition = new Material();
            this._debugMatPosition.initialize({
                // 'effectName': 'builtin-standard',
                'effectName': 'unlit',
                'defines': { USE_INSTANCING: true }
            })
            this._debugMatPosition.setProperty('mainColor', new Color(255, 0, 0, 255));
            this._debugMatPosition.onLoaded();
        }
        return this._debugMatPosition;
    }

    get DebugMatHeight(): Material {
        if (this._debugMatHeight == null) {
            this._debugMatHeight = new Material();
            this._debugMatHeight.initialize({
                'effectName': 'unlit',
                'defines': { USE_INSTANCING: true },
                'states': {
                    'depthStencilState': {
                        'depthFunc': gfx.ComparisonFunc.ALWAYS
                    },
                },
            })
            this._debugMatHeight.setProperty('mainColor', new Color(255, 255, 0, 255));
            this._debugMatHeight.onLoaded();
        }
        return this._debugMatHeight;
    }

    get DebugMatLine(): Material {
        if (this._debugMatLine == null) {
            this._debugMatLine = new Material();
            this._debugMatLine.initialize({
                'effectName': 'unlit',
                'defines': { USE_INSTANCING: true },
                'states': {
                    'depthStencilState': {
                        'depthFunc': gfx.ComparisonFunc.ALWAYS
                    },
                    'rasterizerState': {
                        'cullMode': gfx.CullMode.NONE,
                    },
                    'primitive': gfx.PrimitiveMode.LINE_LIST,
                },
            })
            this._debugMatLine.setProperty('mainColor', Color.BLACK);
            this._debugMatLine.onLoaded();
        }
        return this._debugMatLine;
    }

    private _debugMatPosition: Material = null!;
    private _debugMatHeight: Material = null!;
    private _debugMatLine: Material = null!;
    private _debugMeshBox: Mesh = null!;
    private _debugMeshLine: Mesh = null!;

    private _debugPosRoot: Node = null!;
    private _debugPosScale: Vec3 = new Vec3(0.05, 0.05, 0.05);

    private _debugHeightRoot: Node = null!;
    private _debugHeightScale: Vec3 = new Vec3(0.15, 0.15, 0.15);

    constructor() {
        super();
        WaterWaves.instance = this;
    }

    start() {
        const mr = this.getComponent(MeshRenderer)!;
        mr.enabled = false;
        this._meshRenderer = this.addComponent(MeshRenderer)!;
        this.generateWaterMesh();
        this._vertexLength = (this.columns * this.rows - 1);
        this._faceLength = 2 * (this.rows - 1) * (this.columns - 1);
        this._meshRenderer.material = mr.material;
        this._meshRenderer.mesh = this._mesh;
        this._indices = this._mesh.readIndices(0) as Uint16Array;
        this._positions = this._mesh.readAttribute(0, gfx.AttributeName.ATTR_POSITION) as Float32Array;
        this._normals = this._mesh.readAttribute(0, gfx.AttributeName.ATTR_NORMAL) as Float32Array;
        this._basePositions = new Float32Array(this._positions);
        this._worldPositions = new Float32Array(this._positions);

        if (this.debugPosition) {
            this._debugPosRoot = new Node('debugPosRoot');
            game.addPersistRootNode(this._debugPosRoot);
        }
        if (this.debugHeight) {
            this._debugHeightRoot = new Node('debugHeightRoot');
            game.addPersistRootNode(this._debugHeightRoot);
        }

        for (let i = 0; i < this._vertexLength; i++) {
            const index = i * 3;
            v3_0.set(this._positions[index], this._positions[index + 1], this._positions[index + 2]);
            Vec3.transformMat4(v3_0, v3_0, this.node.worldMatrix);
            this._worldPositions[index] = v3_0.x;
            this._worldPositions[index + 1] = v3_0.y;
            this._worldPositions[index + 2] = v3_0.z;
            if (this.debugPosition) {
                const n = new Node(`debugPos_${i}`);
                const m = n.addComponent(MeshRenderer);
                this._debugPosRoot.addChild(n);
                m.mesh = this.DebugMeshBox;
                m.material = this.DebugMatPos;
                n.worldScale = this._debugPosScale;
                n.setWorldPosition(v3_0);
            }
        }
    }

    update(deltaTime: number) {
        this.updateWaves();
    }

    lateUpdate() {
        if (this._meshDirty) {
            this.recalculateNormals();
            const data = this._mesh.data;
            const dataView = new DataView(data.buffer);
            const struct = this._mesh.struct;
            const vertexView = struct.vertexBundles[0].view;
            const count = vertexView.count;
            for (let i = 0; i < count; i++) {
                const offset = vertexView.stride * i;
                const index = i * 3;
                dataView.setFloat32(offset + Float32Array.BYTES_PER_ELEMENT, this._positions[index + 1], sys.isLittleEndian);
                dataView.setFloat32(offset + 3 * Float32Array.BYTES_PER_ELEMENT, this._normals[index], sys.isLittleEndian);
                dataView.setFloat32(offset + 4 * Float32Array.BYTES_PER_ELEMENT, this._normals[index + 1], sys.isLittleEndian);
                dataView.setFloat32(offset + 5 * Float32Array.BYTES_PER_ELEMENT, this._normals[index + 2], sys.isLittleEndian);
            }
            this._mesh.reset({ struct: this._mesh.struct, data: this._mesh.data, });
            this._meshRenderer.mesh = this._mesh;

            if (this.debugPosition) {
                for (let i = 0; i < this._vertexLength; i++) {
                    const n = this._debugPosRoot.children[i];
                    const index = i * 3;
                    v3_0.set(this._worldPositions[index], this._worldPositions[index + 1], this._worldPositions[index + 2]);
                    n.setWorldPosition(v3_0);
                }
            }

            this._meshDirty = false;
        }
    }

    onDestroy() {
        if (this._debugHeightRoot) this._debugHeightRoot.destroy();
        if (this._debugMatPosition) this._debugMatPosition.destroy();
    }

    getWaterHeight(worldPoint: Vec3) {
        let meshPolygon = this.getSurroundingTrianglePolygon(worldPoint);
        if (meshPolygon) {
            Vec3.subtract(v3_0, meshPolygon[1], meshPolygon[0]);
            Vec3.subtract(v3_1, meshPolygon[2], meshPolygon[0]);
            Vec3.cross(v3_0, v3_0, v3_1);
            v3_0.normalize();
            if (v3_0.y < 0) Vec3.multiplyScalar(v3_0, v3_0, -1);
            const y = (-(worldPoint.x * v3_0.x) - (worldPoint.z * v3_0.z) + Vec3.dot(meshPolygon[0], v3_0)) / v3_0.y;
            if (this.debugHeight) {
                v3_0.set(worldPoint.x, y, worldPoint.z);
                this.drawDebugHeight(v3_0, meshPolygon);
            }
            return y;
        }
        return -Number.MAX_VALUE;
    }

    getSurfaceNormal(worldPoint: Vec3, out: Vec3) {
        let meshPolygon = this.getSurroundingTrianglePolygon(worldPoint);
        if (meshPolygon != null) {
            Vec3.subtract(v3_0, meshPolygon[1], meshPolygon[0]);
            Vec3.subtract(v3_1, meshPolygon[2], meshPolygon[0]);
            Vec3.cross(out, v3_0, v3_1);
            if (out.y < 0) Vec3.multiplyScalar(out, out, -1);
            out.normalize();
        }
    }

    getIndex(row: number, column: number) {
        return row * this.columns + column;
    }

    getSurroundingTrianglePolygon(worldPoint: Vec3): Vec3[] | null {
        Mat4.invert(mat4_0, this.node.worldMatrix);
        Vec3.transformMat4(v3_0, worldPoint, mat4_0);
        let xf = v3_0.x + this._offsetX, zf = v3_0.z + this._offsetZ;
        let x = Math.ceil(xf), z = Math.ceil(zf);
        if (xf < 0 || zf < 0 || x >= this.rows || z >= this.columns)
            return null;
        const index0 = this.getIndex(x, z) * 3;
        const index1 = this.getIndex(x - 1, z - 1) * 3;
        const a = v3_arr[0], b = v3_arr[1], c = v3_arr[2];
        const wp = this._worldPositions;
        a.set(wp[index0], wp[index0 + 1], wp[index0 + 2]);
        b.set(wp[index1], wp[index1 + 1], wp[index1 + 2]);
        if (Vec3.squaredDistance(a, worldPoint) > Vec3.squaredDistance(b, worldPoint)) {
            Vec3.copy(a, b);
        }
        const index2 = this.getIndex(x - 1, z) * 3;
        const index3 = this.getIndex(x, z - 1) * 3;
        b.set(wp[index2], wp[index2 + 1], wp[index2 + 2]);
        c.set(wp[index3], wp[index3 + 1], wp[index3 + 2]);
        return v3_arr;
    }

    generateWaterMesh() {
        if (!this._mesh) {
            const positions: number[] = [];
            const indices: number[] = [];
            const normals: number[] = [];
            this._offsetX = this.tileSize * ((this.rows - 1) / 2);
            this._offsetZ = this.tileSize * ((this.columns - 1) / 2);
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < this.rows; j++) {
                    const index = j + i * this.rows;
                    positions[index * 3] = i * this.tileSize - this._offsetX;
                    positions[index * 3 + 1] = 0;
                    positions[index * 3 + 2] = j * this.tileSize - this._offsetZ;
                    normals[index * 3] = 0; normals[index * 3 + 1] = 1; normals[index * 3 + 2] = 0;
                    if (i < this.columns - 1 && j < this.rows - 1) {
                        Array.prototype.push.apply(indices, [
                            index, index + 1, index + this.rows + 1,
                            index, index + this.rows + 1, index + this.rows,
                        ])
                    }
                }
            }
            // left
            let last = this.columns * this.rows - 1;
            for (let i = 0; i < this.rows; i++) {
                const index = last + i + 1;
                positions[index * 3] = - this._offsetX;
                positions[index * 3 + 1] = this.bottom;
                positions[index * 3 + 2] = i * this.tileSize - this._offsetZ;
                normals[index * 3] = 1; normals[index * 3 + 1] = 0; normals[index * 3 + 2] = 0;
                if (i < this.rows - 1) {
                    Array.prototype.push.apply(indices, [
                        index, i + 1, i,
                        index, index + 1, i + 1,
                    ])
                }
            }
            // right
            last += this.rows;
            for (let i = 0; i < this.rows; i++) {
                const index = last + i + 1;
                positions[index * 3] = this._offsetX;
                positions[index * 3 + 1] = this.bottom;
                positions[index * 3 + 2] = i * this.tileSize - this._offsetZ;
                normals[index * 3] = 1; normals[index * 3 + 1] = 0; normals[index * 3 + 2] = 0;
                if (i < this.rows - 1) {
                    const offset = (this.columns - 1) * this.rows;
                    Array.prototype.push.apply(indices, [
                        index, i + offset, i + 1 + offset,
                        index, i + 1 + offset, index + 1,
                    ])
                }
            }
            // back
            last += this.rows;
            for (let i = 0; i < this.columns; i++) {
                const index = last + i + 1;
                positions[index * 3] = i * this.tileSize - this._offsetX;
                positions[index * 3 + 1] = this.bottom;
                positions[index * 3 + 2] = - this._offsetZ;
                normals[index * 3] = 1; normals[index * 3 + 1] = 0; normals[index * 3 + 2] = 0;
                if (i < this.rows - 1) {
                    Array.prototype.push.apply(indices, [
                        index, i * this.rows, (i + 1) * this.rows,
                        index, (i + 1) * this.rows, index + 1,
                    ])
                }
            }
            // front
            last += this.columns;
            for (let i = 0; i < this.columns; i++) {
                const index = last + i + 1;
                positions[index * 3] = i * this.tileSize - this._offsetX;
                positions[index * 3 + 1] = this.bottom;
                positions[index * 3 + 2] = this._offsetZ;
                normals[index * 3] = 1; normals[index * 3 + 1] = 0; normals[index * 3 + 2] = 0;
                if (i < this.rows - 1) {
                    Array.prototype.push.apply(indices, [
                        index, (i + 1) * this.rows + this.columns - 1, i * this.rows + this.columns - 1,
                        index, index + 1, (i + 1) * this.rows + this.columns - 1,
                    ])
                }
            }
            this._mesh = utils.createMesh({ positions, indices, normals }, undefined, { 'calculateBounds': true });
            this._mesh.onLoaded();
        }
    }

    drawDebugHeight(wp: Vec3, triangle: Vec3[]) {
        const key = `${wp.x}-${wp.y}`;
        {
            let n: Node;
            let m: MeshRenderer;
            if (this._debugHeightRoot.children.length > 0) {
                n = this._debugHeightRoot.children[0];
                m = n.getComponent(MeshRenderer)!;
            } else {
                n = new Node(key);
                this._debugHeightRoot.addChild(n);
                m = n.addComponent(MeshRenderer);
            }
            m.mesh = this.DebugMeshBox;
            m.material = this.DebugMatHeight;
            n.worldScale = this._debugHeightScale;
            n.worldPosition = wp;
        }
        {
            let n: Node;
            let m: MeshRenderer;
            if (this._debugHeightRoot.children.length > 1) {
                n = this._debugHeightRoot.children[1];
                m = n.getComponent(MeshRenderer)!;
            } else {
                n = new Node(key);
                this._debugHeightRoot.addChild(n);
                m = n.addComponent(MeshRenderer);
                m.mesh = this.DebugMeshLine;
                m.material = this.DebugMatLine;
            }
            const mesh = this.DebugMeshLine;
            const data = mesh.data;
            const dataView = new DataView(data.buffer);
            const struct = mesh.struct;
            const vertexView = struct.vertexBundles[0].view;
            const count = vertexView.count;
            for (let i = 0; i < count; i++) {
                let offset = vertexView.stride * i;
                dataView.setFloat32(offset, triangle[i].x, sys.isLittleEndian);
                offset = vertexView.stride * i + Float32Array.BYTES_PER_ELEMENT;
                dataView.setFloat32(offset, triangle[i].y, sys.isLittleEndian);
                offset = vertexView.stride * i + Float32Array.BYTES_PER_ELEMENT * 2;
                dataView.setFloat32(offset, triangle[i].z, sys.isLittleEndian);
            }
            mesh.reset({ struct: mesh.struct, data: mesh.data, });
            m.mesh = mesh;
        }
    }

    updateWaves() {
        for (let i = 0; i < this._vertexLength; i++) {
            const index = i * 3;
            let y = this._basePositions[index + 1];
            if (y < -this.height / this.node.scale.y - 1e-3) return; // continue;
            y += Math.sin(director.getTotalTime() / 1000 * this.speed + this._basePositions[index] + this._basePositions[index + 1] + this._basePositions[index + 2])
                * (this.height / this.node.scale.y);
            y += Noise.snoise(this._basePositions[index] + this.noiseWalk, this._basePositions[index + 1] /*+ Math.sin(director.getTotalTime() / 1000 * 0.1)*/)
                * this.noiseStrength;
            this._positions[index + 1] = y;
            v3_0.set(this._positions[index], this._positions[index + 1], this._positions[index + 2]);
            Vec3.transformMat4(v3_0, v3_0, this.node.worldMatrix);
            this._worldPositions[index] = v3_0.x;
            this._worldPositions[index + 1] = v3_0.y;
            this._worldPositions[index + 2] = v3_0.z;
            this._meshDirty = true;
        }
    }

    recalculateNormals() {
        this._normals.fill(0, 0, this._vertexLength * 3 + 2);
        for (let i = 0; i < this._faceLength; i++) {
            const index = i * 3;
            const i0 = this._indices[index], i1 = this._indices[index + 1], i2 = this._indices[index + 2];
            const v0 = i0 * 3, v1 = i1 * 3, v2 = i2 * 3;
            const va = v3_arr[0], vb = v3_arr[1], vc = v3_arr[2];
            va.set(this._worldPositions[v0], this._worldPositions[v0 + 1], this._worldPositions[v0 + 2]);
            vb.set(this._worldPositions[v1], this._worldPositions[v1 + 1], this._worldPositions[v1 + 2]);
            vc.set(this._worldPositions[v2], this._worldPositions[v2 + 1], this._worldPositions[v2 + 2]);
            Vec3.subtract(vb, va, vb); Vec3.subtract(vc, va, vc); Vec3.cross(vb, vb, vc);
            this._normals[v0] += vb.x; this._normals[v0 + 1] += vb.y; this._normals[v0 + 2] += vb.z;
            this._normals[v1] += vb.x; this._normals[v1 + 1] += vb.y; this._normals[v1 + 2] += vb.z;
            this._normals[v2] += vb.x; this._normals[v2 + 1] += vb.y; this._normals[v2 + 2] += vb.z;
        }
    }
}
