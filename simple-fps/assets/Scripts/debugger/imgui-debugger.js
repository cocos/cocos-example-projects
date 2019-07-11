
export class IMGUIDebugger {
    constructor () {
        this._imgui = null;
        this._imguiImpl = null;
        setupSystemJs(() => {
            loadImGui((ImGui, ImGui_Impl) => {
                this._setupIMGUI(ImGui, ImGui_Impl);
                this._imgui = ImGui;
                this._imguiImpl = ImGui_Impl;
                window.GlobalIMGUI = ImGui;
            });
        });
    }

    get imgui () {
        return this._imgui;
    }

    startFrame (time) {
        if (!this._imgui) {
            return;
        }

        this._imguiImpl.NewFrame(time);
        this._imgui.NewFrame();

        this._imgui.SetNextWindowPos(new this._imgui.ImVec2(0, 0), this._imgui.Cond.FirstUseEver);
        this._imgui.SetNextWindowSize(new this._imgui.ImVec2(294, 140), this._imgui.Cond.FirstUseEver);
    }

    endFrame () {
        if (!this._imgui) {
            return;
        }

        const clear_color = new this._imgui.ImVec4(0.45, 0.55, 0.60, 1.0);

        this._imgui.EndFrame();

        this._imgui.Render();
        const gl = this._imguiImpl.gl;
        gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl && gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
        gl && gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound

        this._imguiImpl.RenderDrawData(this._imgui.GetDrawData());
    }

    destroy () {
        this._imguiImpl.Shutdown();
        this._imgui.DestroyContext();
    }

    _setupIMGUI (ImGui, ImGui_Impl) {
        const canvas = this._getIMGUICanvas();
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.scrollWidth * devicePixelRatio;
        canvas.height = canvas.scrollHeight * devicePixelRatio;
        window.addEventListener("resize", () => {
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width = canvas.scrollWidth * devicePixelRatio;
            canvas.height = canvas.scrollHeight * devicePixelRatio;
        });

        ImGui.CreateContext();
        ImGui_Impl.Init(canvas);

        ImGui.StyleColorsDark();
        //ImGui.StyleColorsClassic();
    }

    _getIMGUICanvas () {
        const canvas = document.createElement('canvas');
        canvas.id = 'IMGUI Canvas';
        cc.game.canvas.parentElement.appendChild(canvas);
        canvas.width = 294;
        canvas.height = 140;
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.position = 'absolute';
        canvas.style.opacity = 0.5;
        return canvas;
    }
}

function setupSystemJs (callback) {
    const systemJSScript = document.createElement('script');
    systemJSScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.24/system.js';
    document.body.appendChild(systemJSScript);
    systemJSScript.addEventListener('load', () => {
        SystemJS.config({
            map: {
                "imgui-js": "https://flyover.github.io/imgui-js",
            },
            packages: {
                "imgui-js": { main: "imgui.js" },
            }
        });
        callback();
    });
}

function loadImGui (callback) {
    let ImGui;
    let ImGui_Impl;
    Promise.resolve(
    ).then(() => {
        return SystemJS.import("imgui-js").then((module) => {
          ImGui = module;
          return ImGui.default();
        });
    }).then(() => {
        return SystemJS.import("imgui-js/example/imgui_impl").then((module) => {
          ImGui_Impl = module;
        });
    }).then(() => {
        callback(ImGui, ImGui_Impl);
    });
}
