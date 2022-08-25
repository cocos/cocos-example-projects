import { _decorator, Component, Node, Label, Color } from 'cc';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

///<reference path="./Demo.d.ts" />

@ccclass('HelloNative')
export class HelloNative extends Component {

    @property({ type: Label })
    stateLabel: Label;

    @property({ type: Label })
    resultLabel: Label;

    start() {
        if (NATIVE) {
            if (typeof Demo === 'undefined') {
                this.failTest(
                    "FAILED: class is not exported, native plugin not enabled?",
                    "[empty]");
            } else {
                const d = new Demo("Cocos");
                this.stateLabel.string = "SUCCESS: see message⬆";
                this.resultLabel.string = d.hello("World");
            }
        } else {
            this.failTest("FAILED: not supported", "[empty]");
        }
    }

    private failTest(state: string, error: string) {
        this.stateLabel.string = state;
        this.resultLabel.string = error;
        this.stateLabel.color = Color.RED;
    }
}


