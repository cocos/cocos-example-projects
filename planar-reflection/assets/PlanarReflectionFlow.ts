import { _decorator, Component, Node, RenderPipeline, RenderFlow, GFXTextureView, GFXFramebuffer, RenderView, renderer, CameraComponent, Mat4, Vec4, Vec3, Mat3, Layers, Color } from "cc";
const { ccclass, property } = _decorator;

const _refVec = new Vec3(1, -1, 1);

function up(v: Vec3, n: Node) {
    Vec3.transformQuat(v, Vec3.UNIT_Y, n.getWorldRotation());
}

function reflectMatrix(mat: Mat4, p: Vec4) {
    mat.m00 = (1 - 2 * p.x * p.x);
    mat.m01 = (-2 * p.x * p.y);
    mat.m02 = (-2 * p.x * p.z);
    mat.m03 = (-2 * p.w * p.x);

    mat.m04 = (-2 * p.y * p.x);
    mat.m05 = (1 - 2 * p.y * p.y);
    mat.m06 = (-2 * p.y * p.z);
    mat.m07 = (-2 * p.w * p.y);

    mat.m08 = (-2 * p.z * p.x);
    mat.m09 = (-2 * p.z * p.y);
    mat.m10 = (1 - 2 * p.z * p.z);
    mat.m11 = (-2 * p.w * p.z);

    mat.m12 = 0;
    mat.m13 = 0;
    mat.m14 = 0;
    mat.m15 = 1;
}

const transformPlaneToCameraSpace = function () {
    const _pos = new Vec3;
    const _norm = new Vec3;
    const _mat3 = new Mat3;
    return (out: Vec4, camera: renderer.Camera, pos: Vec3, n: Vec3, side: number) => {
        const viewMat = camera.matView;
        Vec3.transformMat4(_pos, pos, viewMat);
        Mat3.fromMat4(_mat3, viewMat);
        Vec3.transformMat3(_norm, n, _mat3);
        Vec3.normalize(_norm, _norm);
        Vec3.multiplyScalar(_norm, _norm, side);
        Vec4.set(out, _norm.x, _norm.y, _norm.z, -Vec3.dot(_pos, _norm));
    }
}();

const calculateObliqueMatrix = function () {
    const q: Vec4 = new Vec4;
    const c: Vec4 = new Vec4;
    const projInverse:Mat4 = new Mat4;
    return (camera: renderer.Camera, clipPlane: Vec4) => {
        const projMat = camera.matProj;
        // q.x = (Math.sign(clipPlane.x) + projMat.m08) / projMat.m00;
        // q.y = (Math.sign(clipPlane.y) + projMat.m09) / projMat.m05;
        // q.z = -1.0;
        // q.w = (1.0 + projMat.m10) / projMat.m14;
        // Vec4.multiplyScalar(c, clipPlane, 2 / Vec4.dot(clipPlane, q));
        // projMat.m02 = c.x;
        // projMat.m06 = c.y;
        // projMat.m10 = c.z + 1.0;
        // projMat.m14 = c.w;
        Mat4.invert(projInverse, projMat);
        Vec4.set(c, Math.sign(clipPlane.x), Math.sign(clipPlane.y), 1, 1);
        Vec4.transformMat4(q, c, projInverse);
        Vec4.multiplyScalar(c, clipPlane, 2 / Vec4.dot(clipPlane, q));
        projMat.m02 = c.x - projMat.m03;
        projMat.m06 = c.y - projMat.m07;
        projMat.m10 = c.z - projMat.m11;
        projMat.m14 = c.w - projMat.m15;
    }
}();

@ccclass("PlanarReflectionFlow")
export class PlanarReflectionFlow extends RenderFlow {

    destroy () {
        throw new Error("Method not implemented.");
    }

    rebuild () {
        throw new Error("Method not implemented.");
    }

    resize (width: number, height: number): void {

    }

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    set reflectNode(val: Node) {
        this._reflectNode = val;
    }

    private _reflectNode: Node;
    private _reflectPlane: Vec4 = new Vec4;
    private _refPlaneUp: Vec3 = new Vec3;

    private _reflectTex: GFXTextureView;
    private _reflectFB: GFXFramebuffer;
    private _reflectView: RenderView;
    private _reflectCamera: renderer.Camera;

    private _reflectMat: Mat4 = new Mat4;

    activate(p: RenderPipeline) {
        // Your initialization goes here.
        super.activate(p);
        this._reflectTex = p.getTextureView('reflection');
        this._reflectFB = p.getFrameBuffer('reflect');
        this._reflectCamera = new renderer.Camera();
        this._reflectCamera.initialize({
            name: 'ReflectCamera',
            node: null,
            projection: CameraComponent.ProjectionType.PERSPECTIVE,
            window: cc.director.root.mainWindow,
            priority: 0,
            flows: [],
        });
        this._reflectView = this._reflectCamera.view;
        this._material.setProperty('reflectTexture', this._reflectTex);
    }

    render(view: RenderView) {
        // Your update function goes here.
        if (!this._reflectNode) {
            return;
        }
        view.camera.update();
        this._reflectCamera._scene = view.camera.scene;
        this._reflectCamera.node = view.camera.node;
        this._reflectCamera.viewport = view.camera.viewport;
        this._reflectCamera.fov = view.camera.fov;
        this._reflectCamera.orthoHeight = view.camera.orthoHeight;
        this._reflectCamera.nearClip = view.camera.nearClip;
        this._reflectCamera.farClip = view.camera.farClip;
        this._reflectCamera.clearColor = { r: Color.TRANSPARENT.x, g: Color.TRANSPARENT.y, b: Color.TRANSPARENT.z, a: Color.TRANSPARENT.w };
        this._reflectCamera.clearDepth = view.camera.clearDepth;
        this._reflectCamera.clearStencil = view.camera.clearStencil;
        this._reflectCamera.clearFlag = view.camera.clearFlag;
        this._reflectCamera.visibility = view.camera.visibility & ~Layers.BitMask['reflect'];

        const pos = this._reflectNode.getWorldPosition();
        up(this._refPlaneUp, this._reflectNode);
        this._reflectPlane.set(this._refPlaneUp.x, this._refPlaneUp.y, this._refPlaneUp.z, Vec3.dot(this._refPlaneUp, pos) * -1);
        Mat4.copy(this._reflectMat, Mat4.IDENTITY);
        Mat4.scale(this._reflectMat, this._reflectMat, _refVec);
        reflectMatrix(this._reflectMat, this._reflectPlane);

        Mat4.multiply(this._reflectCamera.matView, view.camera.matView, this._reflectMat);
        const camPlane: Vec4 = new Vec4;
        transformPlaneToCameraSpace(camPlane, this._reflectCamera, pos, this._refPlaneUp, 1);
        Mat4.copy(this._reflectCamera.matProj, view.camera.matProj);
        calculateObliqueMatrix(this._reflectCamera, camPlane);

        this.pipeline.sceneCulling(this._reflectView);
        this.pipeline.updateUBOs(this._reflectView);
        cc.director.root.device.reverseCW = true;
        super.render(this._reflectView);
        cc.director.root.device.reverseCW = false;
    }
}
