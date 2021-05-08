
import { _decorator, Component, Node, RigidBody, Collider, Vec3, PhysicsSystem, clamp, lerp, Mat4, Quat, Material, Mesh, Primitive, Color, MeshRenderer, gfx, physics } from 'cc';
import { WaterWaves } from './WaterWaves';
const { ccclass, property, menu, requireComponent } = _decorator;

const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const v3_3 = new Vec3();
const v3_4 = new Vec3();
const q_0 = new Quat();
const mat4_0 = new Mat4();

@ccclass('BUOYANCY.Buoyancy')
@requireComponent(RigidBody)
@requireComponent(Collider)
@menu("demo/buoyancy/Buoyancy")
export class Buoyancy extends Component {

    @property
    density = 1;

    @property
    dampingInWater = 0.5;

    @property
    angularDampingInWater = 0.5;

    @property
    normalizedVoxelSize = 0.5;

    @property
    debugVoxel = false;

    private _rigidBody: RigidBody = null!;
    private _collider: Collider = null!;
    private _initDamping = 0.1;
    private _initAngularDamping = 0.1;
    private _voxelSize = new Vec3();
    private _voxels: Vec3[] = [];

    private _debugMat: Material = null!;
    private _debugMesh: Mesh = null!;

    get DebugMesh(): Mesh {
        if (this._debugMesh == null) {
            this._debugMesh = new Primitive(Primitive.PrimitiveType.BOX);
            this._debugMesh.onLoaded();
        }
        return this._debugMesh;
    }

    get DebugMat(): Material {
        if (this._debugMat == null) {
            this._debugMat = new Material();
            this._debugMat.initialize({
                // 'effectName': 'builtin-standard',
                'effectName': 'unlit',
                'defines': { USE_INSTANCING: true },
                'states': {
                    'depthStencilState': {
                        'depthFunc': gfx.ComparisonFunc.ALWAYS,
                    }
                }
            })
            this._debugMat.setProperty('mainColor', new Color(0, 255, 0, 255));
            this._debugMat.onLoaded();
        }
        return this._debugMat;
    }

    private _debugVoxelRoot: Node = null!;
    private _debugVoxelScale: Vec3 = new Vec3(0.5, 0.5, 0.5);

    start() {
        this._rigidBody = this.getComponent(RigidBody)!;
        this._initDamping = this._rigidBody.linearDamping;
        this._initAngularDamping = this._rigidBody.angularDamping;
        this._collider = this.getComponent(Collider)!;
        this.voxelization();

        if (this.debugVoxel) {
            this._debugVoxelRoot = new Node('debugVoxelRoot');
            this.node.addChild(this._debugVoxelRoot);
            Vec3.multiplyScalar(this._debugVoxelScale, this._debugVoxelScale, this.normalizedVoxelSize);
            for (let i = 0; i < this._voxels.length; i++) {
                const n = new Node(`debugVoxel_${i}`);
                const m = n.addComponent(MeshRenderer);
                this._debugVoxelRoot.addChild(n);
                m.mesh = this.DebugMesh;
                m.material = this.DebugMat;
                n.scale = this._debugVoxelScale;
                n.position = this._voxels[i];
            }
        }
    }

    lateUpdate(deltaTime: number) {
        this.solver();
    }

    solver() {
        const voxels = this._voxels;
        if (voxels.length > 0) {
            const singleForce = v3_0;
            this.maxBuoyancyForce(singleForce);
            Vec3.multiplyScalar(singleForce, singleForce, 1 / voxels.length);
            const bounds = this._collider.worldBounds;
            const voxelHeight = bounds.halfExtents.y * this.normalizedVoxelSize * 2;
            // const voxelHeight = this._voxelSize.y;
            let submergedVolume = 0;
            for (let i = 0; i < voxels.length; i++) {
                const worldPoint = v3_1;
                Vec3.transformMat4(worldPoint, voxels[i], this.node.worldMatrix);
                let waterHeight = WaterWaves.instance.getWaterHeight(worldPoint);
                let deepFactor = waterHeight - worldPoint.y + voxelHeight / 2;
                let submergedFactor = clamp(deepFactor / voxelHeight, 0, 1);
                submergedVolume += submergedFactor;
                if (this.debugVoxel) this._debugVoxelRoot.children[i].active = submergedFactor != 0;
                if (submergedFactor == 0) continue;
                const suffaceRotation = q_0;
                const waterNormal = v3_3;
                WaterWaves.instance.getSurfaceNormal(worldPoint, waterNormal);
                Quat.rotationTo(suffaceRotation, Vec3.UP, waterNormal);
                Quat.slerp(suffaceRotation, suffaceRotation, Quat.IDENTITY, submergedFactor);
                const finalVoxelForce = v3_2;
                Vec3.multiplyScalar(finalVoxelForce, singleForce, submergedFactor);
                Vec3.transformQuat(finalVoxelForce, finalVoxelForce, suffaceRotation)
                Vec3.subtract(worldPoint, worldPoint, this.node.worldPosition);
                this._rigidBody.applyForce(finalVoxelForce, worldPoint);
            }
            submergedVolume /= voxels.length;
            this._rigidBody.linearDamping = lerp(this._initDamping, this.dampingInWater, submergedVolume);
            this._rigidBody.angularDamping = lerp(this._initAngularDamping, this.angularDampingInWater, submergedVolume);
        }
        // v3_0.set(this.node.worldPosition);
        // v3_0.y = WaterWaves.instance.getWaterHeight(this.node.worldPosition);
        // this.node.worldPosition = v3_0;
    }

    maxBuoyancyForce(out: Vec3) {
        let objectVolume = this._rigidBody.mass / this.density;
        const waterDensity = WaterWaves.instance.Density;
        Vec3.multiplyScalar(out, PhysicsSystem.instance.gravity, -waterDensity * objectVolume);
    }

    voxelization() {
        const _voxelSize = this._voxelSize;
        const bounds = this._collider.worldBounds;
        Vec3.multiplyScalar(_voxelSize, bounds.halfExtents, 2 * this.normalizedVoxelSize);
        let count = Math.round(1 / this.normalizedVoxelSize);
        let min = new Vec3(), max = new Vec3();
        bounds.getBoundary(min, max);
        Mat4.invert(mat4_0, this.node.worldMatrix);
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                for (let k = 0; k < count; k++) {
                    let point = new Vec3(
                        min.x + _voxelSize.x * (0.5 + i),
                        min.y + _voxelSize.y * (0.5 + j),
                        min.z + _voxelSize.z * (0.5 + k)
                    );
                    Vec3.transformMat4(point, point, mat4_0);
                    if (true)
                        this._voxels.push(point);
                }
            }
        }
    }
}