import { _decorator, Component, ModelComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DebugInfo")
export class DebugInfo extends Component {

    @property([ModelComponent])
    targets = [];

    printActiveUniforms () {
        this.targets.forEach((comp) => {
            console.log(comp.node.name, '---------------------------------------');
            const pso = comp._model._subModels[0]._psos[0];
            const shader = pso._shader._gpuShader;
            const gl = cc.director.root.device.gl;
            shader.glBlocks.reduce((acc, cur) => acc.concat(cur.glActiveUniforms), []).forEach((u) => {
                const data = gl.getUniform(shader.glProgram, gl.getUniformLocation(shader.glProgram, u.name));
                console.log(u.name, Array.from(data).reduce((acc, cur) => `${acc} ${cur.toFixed(2)}`, ''));
            });
        });
        console.log('scene', cc.director.root._scenes);
        console.log('window', cc.director.root._windows);
        console.log('view', cc.director.root._views);
    }

    printJointsTexture () {
        const info = cc.director._scene._renderScene._texturePool._pool._chunks[0].texture;
        const texture = info._gpuTexture.glTexture;
        const pixels = new Float32Array(info.width * info.height * 4);

        const gl = cc.director.root.device.gl;
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
