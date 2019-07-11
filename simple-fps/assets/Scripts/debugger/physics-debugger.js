const { Component, ColliderComponentBase } = cc;
const { ccclass } = cc._decorator;
import { PhysicsComponentsDebugger } from './physics-comps-debugger';
import { IMGUIDebugger as ImGuiDebugger } from './imgui-debugger';

@ccclass('demo.physics-debugger')
export class PhysicsDebugger extends Component {
    constructor () {
        super();
        this._imguiDebugger = null;
        this._hideModel = false;
    }

    start () {
        this._imguiDebugger = new ImGuiDebugger();
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
            this._imguiDebugger.startFrame(Date.now());
        });
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
            this._imguiDebugger.endFrame();
        });
    }

    update (deltaTime) {
        if (window.GlobalIMGUI) {
            GlobalIMGUI.Begin("Debug");
            try {
                // eval(editor.getValue());
                // GlobalIMGUI.Text(`Hello, world.`);
                if (GlobalIMGUI.Button(`Only display colliders`)) {
                    this._hideModel = !this._hideModel;
                }
                // if (GlobalIMGUI.BeginCombo("", "")) {
                //     GlobalIMGUI.Selectable("");
                //     GlobalIMGUI.EndCombo();
                // }
            } catch (e) {
                GlobalIMGUI.TextColored(new GlobalIMGUI.ImVec4(1.0,0.0,0.0,1.0), "error: ");
                GlobalIMGUI.SameLine();
                GlobalIMGUI.Text(e.message);
            }
        
            GlobalIMGUI.End();
        }

        this.updateComponentsDebuggerRecursive(this.node.scene);
    }

    onDestroy () {
        if (this._imguiDebugger) {
            this._imguiDebugger.destroy();
            this._imguiDebugger = null;
        }
        super.onDestroy();
    }

    updateComponentsDebuggerRecursive (node) {
        const colliderComponents = node.getComponents(ColliderComponentBase);
        const debuggerComponent = node.getComponent(PhysicsComponentsDebugger);
        if (colliderComponents.length !== 0 && debuggerComponent === null) {
            node.addComponent(PhysicsComponentsDebugger);
        } else if (colliderComponents.length === 0 && debuggerComponent !== null) {
            node.removeComponent(PhysicsComponentsDebugger);
        }
        if (debuggerComponent) {
            debuggerComponent.hideModel = this._hideModel;
        }
        node.children.forEach((childNode) => this.updateComponentsDebuggerRecursive(childNode));
    }
}
