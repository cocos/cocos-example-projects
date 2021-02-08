import { _decorator, Component, ModelComponent, director, GFXAPI } from 'cc';
const { ccclass, property } = _decorator;

let gl: WebGLRenderingContext | null = null;

@ccclass('DebugInfo')
export class DebugInfo extends Component {

    @property([ModelComponent])
    public targets: ModelComponent[] = [];

    public printActiveUniforms () {
        if (director.root.device.gfxAPI === GFXAPI.WEBGL || director.root.device.gfxAPI === GFXAPI.WEBGL2) {
            this.targets.forEach((comp) => {
                console.log(comp.node.name, '---------------------------------------');
                // @ts-ignore
                const psoCI = comp._model._subModels[0]._psoCreateInfos[0]; gl = director.root.device.gl; const shader = psoCI.shader.gpuShader;
                shader.glBlocks.reduce((acc: any[], cur: any) => acc.concat(cur.glActiveUniforms), []).forEach((u: any) => {
                    const data = gl.getUniform(shader.glProgram, gl.getUniformLocation(shader.glProgram, u.name)) as Float32Array;
                    console.log(u.name, Array.from(data).reduce((acc, cur) => `${acc} ${cur.toFixed(2)}`, ''));
                });
            });
        }
        console.log('scene', director.root.scenes);
        console.log('window', director.root.windows);
        console.log('view', director.root.views);
    }

    public printJointsTexture () {
        // @ts-ignore
        const info = director.root.dataPoolManager.jointTexturePool._pool._chunks[0].texture;
        const texture = info._gpuTexture.glTexture;
        const pixels = new Float32Array(info.width * info.height * 4);

        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.readPixels(0, 0, info.width, info.height, gl.RGBA, gl.FLOAT, pixels);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        let str = '';
        for (let i = 0; i < pixels.length; i++) {
            str += pixels[i] + ' ';
            if ((i + 1) % 12 === 0) { str += '\n'; }
        }
        console.log(str);
    }
}
