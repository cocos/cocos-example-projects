import { _decorator, Node, RenderPipeline, RenderFlow, RenderView, Mat4, Vec4, Vec3, Layers, geometry } from "cc";
const { ccclass, property } = _decorator;

function getPlanarReflectionMatrix (out: Mat4, plane: Vec4) {
    const { x, y, z, w } = plane;
    out.m00 = -2 * x * x + 1;
    out.m01 = -2 * x * y;
    out.m02 = -2 * x * z;
    out.m03 = 0;

    out.m04 = -2 * y * x;
    out.m05 = -2 * y * y + 1;
    out.m06 = -2 * y * z;
    out.m07 = 0;

    out.m08 = -2 * z * x;
    out.m09 = -2 * z * y;
    out.m10 = -2 * z * z + 1;
    out.m11 = 0;

    out.m12 = 2 * x * w;
    out.m13 = 2 * y * w;
    out.m14 = 2 * z * w;
    out.m15 = 1;

    return out;
}

const planeTransformMat4 = function () {
    const p = new Vec3();
    const n = new Vec3();
    const m = new Mat4();
    return (out: Vec4, plane: Vec4, mat: Mat4) => {
        Vec3.set(n, plane.x, plane.y, plane.z);
        Vec3.multiplyScalar(p, n, plane.w);
        Vec3.transformMat4(p, p, mat);
        Mat4.inverseTranspose(m, mat);
        Vec3.transformMat4Normal(n, n, m);
        Vec3.normalize(n, n);
        Vec4.set(out, n.x, n.y, n.z, -Vec3.dot(p, n));
    };
}();

// http://aras-p.info/texts/obliqueortho.html
const calculateObliqueMatrix = function () {
    const q = new Vec4();
    const c = new Vec4();
    const projInv = new Mat4();
    return (clipPlane: Vec4, proj: Mat4) => {
        Mat4.invert(projInv, proj);
        Vec4.set(c, Math.sign(clipPlane.x), Math.sign(clipPlane.y), 1, 1);
        Vec4.transformMat4(q, c, projInv);
        Vec4.multiplyScalar(c, clipPlane, 2 / Vec4.dot(clipPlane, q));
        proj.m02 = c.x - proj.m03;
        proj.m06 = c.y - proj.m07;
        proj.m10 = c.z - proj.m11;
        proj.m14 = c.w - proj.m15;
    };
}();

const m4_view = new Mat4();
const m4_proj = new Mat4();
const m4_projInv = new Mat4();
const m4_viewProj = new Mat4();
const m4_viewProjInv = new Mat4();
const fst_camera = new geometry.frustum();
const m4_1 = new Mat4();
const v4_1 = new Vec4();
const v3_1 = new Vec3();

@ccclass("PlanarReflectionFlow")
export class PlanarReflectionFlow extends RenderFlow {

    @property({ type: [Vec4] })
    planes = [ new Vec4(0, 1, 0, 0) ];

    setPlaneFromNode (idx: number, node: Node, localNormal: Vec3 = Vec3.UNIT_Y) {
        Vec3.transformQuat(v3_1, localNormal, node.worldRotation);
        this.planes[idx].set(v3_1.x, v3_1.y, v3_1.z, Vec3.dot(node.worldPosition, v3_1));
    }

    activate (p: RenderPipeline) {
        super.activate(p);
        this._material.setProperty('reflectTexture', p.getTextureView('reflection'));
        Layers.addLayer('REFLECTION', 1);
    }

    render (view: RenderView) {
        view.camera.update();
        const { visibility, matView, matProj, matProjInv, matViewProj, matViewProjInv, frustum } = view.camera;
        view.camera.visibility &= ~Layers.BitMask['REFLECTION'];
        m4_view.set(matView);
        m4_proj.set(matProj);
        m4_projInv.set(matProjInv);
        m4_viewProj.set(matViewProj);
        m4_viewProjInv.set(matViewProjInv);
        geometry.frustum.copy(fst_camera, frustum);

        for (const plane of this.planes) {
            Mat4.multiply(matView, matView, getPlanarReflectionMatrix(m4_1, plane));
            planeTransformMat4(v4_1, plane, matView);
            calculateObliqueMatrix(v4_1, matProj);
            Mat4.multiply(matViewProj, matProj, matView);
            Mat4.invert(matProjInv, matProj);
            Mat4.invert(matViewProjInv, matViewProj);
            frustum.update(matViewProj, matViewProjInv);

            this.pipeline.sceneCulling(view);
            this.pipeline.updateUBOs(view);
            cc.director.root.device.reverseCW = true;
            super.render(view);
            cc.director.root.device.reverseCW = false;
        }

        view.camera.visibility = visibility;
        matView.set(m4_view);
        matProj.set(m4_proj);
        matProjInv.set(m4_projInv);
        matViewProj.set(m4_viewProj);
        matViewProjInv.set(m4_viewProjInv);
        geometry.frustum.copy(frustum, fst_camera);
    }

    destroy () {}
    rebuild () {}
}
