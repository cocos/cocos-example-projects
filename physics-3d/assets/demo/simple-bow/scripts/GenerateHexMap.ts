
import { _decorator, Component, Node, MeshRenderer, instantiate, Prefab, geometry, Vec3, assetManager } from 'cc';
const { ccclass, property, menu } = _decorator;

// assetManager.allowImageBitmap = false;

@ccclass('simple-bow.GenerateHexMap')
@menu("demo/simple-bow/GenerateHexMap")
export class GenerateHexMap extends Component {

    @property(Prefab)
    hexPrefab: Prefab = null!;

    @property
    get generate () { return false; }
    set generate (v) {
        this.generateMap();
    }

    @property
    get clear () { return false; }
    set clear (v) {
        this.node.destroyAllChildren();
    }

    @property
    axisLength = 0;

    @property
    offset = 0.02;

    generateMap () {
        if (this.node.children.length > 0) return;
        if (!this.hexPrefab) return;
        const hexNode = (this.hexPrefab.data as Node);
        const models = hexNode.getComponentsInChildren(MeshRenderer);
        if (models.length <= 0) return;
        const bounds = models[0].mesh!.renderingSubMeshes[0].geometricInfo.boundingBox;
        const worldBouds = geometry.AABB.fromPoints(new geometry.AABB(), bounds.min, bounds.max);
        Vec3.multiply(worldBouds.halfExtents, worldBouds.halfExtents, hexNode.scale);
        const z = worldBouds.halfExtents.z * 2;
        const x = worldBouds.halfExtents.x + z / 2 * Math.tan(Math.PI / 6);
        const size = new Vec3(x, 0, z);
        const length = this.axisLength;
        const mid = length * 2;
        const center = length;
        for (let i = 0; i <= length; i++) {
            const jc = length + i;
            const oZ = (mid - length - i) / 2 * size.z;
            const oX_basis = (i - center) * this.offset;
            for (let j = 0; j <= jc; j++) {
                const clone = instantiate(this.hexPrefab);
                this.node.addChild(clone);
                const iL = i - length;
                const jL = j - length;
                const oZ_basis = (j - center) * this.offset;
                clone.setPosition(size.x * iL + oX_basis, 0, size.z * jL + oZ + oZ_basis);
            }
        }
        for (let i = 0; i < length; i++) {
            const jc = length + i;
            const oZ = (mid - length - i) / 2 * size.z;
            const oX_basis = (-i + center) * this.offset;
            for (let j = 0; j <= jc; j++) {
                const clone = instantiate(this.hexPrefab);
                this.node.addChild(clone);
                const iL = -i + length;
                const jL = j - length;
                const oZ_basis = (j - center) * this.offset;
                clone.setPosition(size.x * iL + oX_basis, 0, size.z * jL + oZ + oZ_basis);
            }
        }
        console.log("Finish.");
    }
}

