
import { _decorator, Component, Node, MeshCollider, TerrainCollider, Mesh, TerrainAsset } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass("CASES.ColliderTest")
@menu("cases/ColliderTest")
export class ColliderTest extends Component {

    @property(Mesh)
    mesh = null;

    @property
    convex = false;

    @property(TerrainAsset)
    terrain = null;

    start() {
        const mc = this.node.addComponent(MeshCollider);
        mc.convex = this.convex;
        if (this.mesh) mc.mesh = this.mesh;

        const tc = this.node.addComponent(TerrainCollider);
        if (this.terrain) tc.terrain = this.terrain;
    }

}
