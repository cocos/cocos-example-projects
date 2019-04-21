import { getDebugUtils, createDebugShapeNode } from './physics-debugger-utils';

const { BoxColliderComponent, SphereColliderComponent, Component, ModelComponent, ColliderComponentBase, RigidBodyComponent } = cc;
const { ccclass } = cc._decorator;
const { box, wireframed } = cc.primitives;
const { createMesh } = cc.utils;

@ccclass('demo.physics-comps-debugger')
export class PhysicsComponentsDebugger extends Component {
    constructor () {
        super();
        this._modelComponent = null;
        this._debugShapeNode = null;
        this.hideModel = false;
    }

    onEnable () {
        const debugUtils = getDebugUtils(this.node);
        this._debugShapeNode = createDebugShapeNode();
        debugUtils.debugShapesHub.addChild(this._debugShapeNode);
        this._modelComponent = this._debugShapeNode.addComponent(ModelComponent);
        cc.loader.loadRes('resources/Materials/BoxColliderShape', cc.Material, (err, asset) => {
            if (!(asset instanceof cc.Material)) {
                throw new Error(`Cannot find asset.`);
            }
            this._modelComponent.material = asset;
        });
    }

    update (deltaTime) {
        const rigidBodyComponent = this.node.getComponent(RigidBodyComponent);
        if (!rigidBodyComponent || !rigidBodyComponent.body) {
            return;
        }

        const currentColliderComponents = this.node.getComponents(ColliderComponentBase);
        if (this._shapesChanged(currentColliderComponents)) {
            const mesh = this._createMesh(currentColliderComponents);
            this._modelComponent.mesh = mesh;
        }

        const physicsBody = rigidBodyComponent.body;
        const cannonBody = physicsBody._getCannonBody();
        this._debugShapeNode.setPosition(cannonBody.position.x, cannonBody.position.y, cannonBody.position.z);

        const modelComponent = this.node.getComponent(ModelComponent);
        if (modelComponent) {
            modelComponent.enabled = !this.hideModel;
        }
    }

    _shapesChanged (currentColliderComponents) {
        return true;
    }

    _createMesh (currentColliderComponents) {
        let mesh = null;
        currentColliderComponents.forEach((colliderComponent) => {
            let geometry = undefined;
            if (colliderComponent instanceof BoxColliderComponent) {
                const scale = this.node.getWorldScale();
                cc.vmath.vec3.multiply(scale, scale, colliderComponent.size);
                cc.vmath.vec3.add(scale, scale, new cc.Vec3(0.1, 0.1, 0.1));
                geometry = box({ width: scale.x, height: scale.y, length: scale.z});
            } else if (colliderComponent instanceof SphereColliderComponent) {
            }
            if (geometry) {
                mesh = createMesh(geometry);
            }
        });
        return mesh;
    }
}