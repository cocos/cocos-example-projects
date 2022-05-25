import { _decorator, CameraComponent, Component, director, EffectAsset, gfx,
    Material, ModelComponent, Node, primitives, Quat, RenderTexture, TextureCube, utils } from 'cc';
const { ccclass, property } = _decorator;

const rotations = [
    Quat.fromEuler(new Quat(),   0, -90, 180), // +X
    Quat.fromEuler(new Quat(),   0,  90, 180), // -X
    Quat.fromEuler(new Quat(), -90, 180, 180), // +Y
    Quat.fromEuler(new Quat(),  90, 180, 180), // -Y
    Quat.fromEuler(new Quat(),   0, 180, 180), // +Z
    Quat.fromEuler(new Quat(),   0,   0, 180), // -Z
];

const readRegions = [new gfx.BufferTextureCopy()];
readRegions[0].texExtent.depth = 1;

const writeRegions = [new gfx.BufferTextureCopy()];
writeRegions[0].texExtent.depth = 1;
writeRegions[0].texSubres.layerCount = 6; // 6 faces

function getMipLevel (size: number) {
    let level = 0;
    while (size) { size >>= 1; level++; }
    return level;
}

const enableDebug = false;

@ccclass('PreFilterEnvmap')
export class PreFilterEnvmap extends Component {

    @property(EffectAsset)
    public effect = null;

    @property
    public blurriness = 0;

    private _camera: CameraComponent = null!;
    private _material: Material = null!;
    private _renderTarget: RenderTexture = null!;

    public onLoad () {
        this._camera = this.node.getComponentInChildren(CameraComponent)!;
        this._renderTarget = this._camera.targetTexture!;
        this._material = new Material();
        this._material.initialize({
            effectAsset: this.effect,
            states: {
                rasterizerState: { cullMode: gfx.CullMode.FRONT },
                depthStencilState: { depthTest: false, depthWrite: false },
            },
        });
        const modelComp = this.node.addComponent(ModelComponent);
        modelComp.mesh = utils.createMesh(primitives.box({ width: 2, height: 2, length: 2 }));
        modelComp.material = this._material;

        if (enableDebug) {
            const testNode = new Node();
            const testMat = new Material();
            testMat.initialize({ effectName: 'builtin-standard', defines: { USE_ALBEDO_MAP: true } });
            testMat.setProperty('albedoMap', this._renderTarget.getGFXTexture());
            const testModelComp = testNode.addComponent(ModelComponent);
            testModelComp.mesh = utils.createMesh(primitives.quad());
            testModelComp.material = testMat;
            testNode.parent = this.node.scene as any;
        }
    }

    public start () {
        if (!enableDebug) {
            const skybox = director.root!.pipeline.pipelineSceneData.skybox;
            skybox.envmap = this.filter(skybox.envmap!);
            // skybox.isRGBE = false;
        }
    }

    // WebGL doesn't support using custom mipmap level in framebuffer attachments,
    // so we'll have to do this the hard way (read back and upload again)
    public filter (envmap: TextureCube) {
        this.node.active = true;
        envmap.setMipFilter(TextureCube.Filter.LINEAR);
        let size = envmap.width; // has to be square
        const camera = this._camera.camera;
        const readRegion = readRegions[0];
        const writeRegion = writeRegions[0];
        const mipLevel = getMipLevel(size);
        const newEnvMap = new TextureCube();
        const pass = this._material.passes[0];
        const handle = pass.getHandle('roughness');
        this.node.setScale(1, director.root!.device.capabilities.clipSpaceSignY, 1); // GL-specific: flip both model and camera so front face stays the same
        camera.scene!.update(0); // should update scene after flipping
        newEnvMap.reset({ width: size, height: size, mipmapLevel: mipLevel });
        newEnvMap.isRGBE = true;
        for (let m = 0; m < mipLevel; m++) {
            // need to resize both window and camera
            camera.window!.resize(size, size);
            camera.resize(size, size);
            readRegion.texExtent.width = readRegion.texExtent.height = size;
            writeRegion.texExtent.width = writeRegion.texExtent.height = size;
            writeRegion.texSubres.mipLevel = m;
            pass.setUniform(handle, this.blurriness + m / (mipLevel - 1) * (1 - this.blurriness));
            pass.update();
            const length = size * size * 4;
            const buffers: Uint8Array[] = [];
            for (let i = 0; i < 6; i++) {
                buffers[i] = new Uint8Array(length);
                this._camera.node.setRotation(rotations[i]);
                this._camera.camera.update();
                director.root!.pipeline.render([camera]);
                director.root!.device.copyTextureToBuffers(camera.window!.framebuffer.colorTextures[0]!, [buffers[i]], readRegions);
            }
            director.root!.device.copyBuffersToTexture(buffers, newEnvMap.getGFXTexture()!, writeRegions);
            size >>= 1;
        }
        this.node.active = false;
        newEnvMap.setMipFilter(TextureCube.Filter.LINEAR);
        return newEnvMap;
    }
}
