import { _decorator, Component, Node, isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnumCommand')
export class EnumCommand extends Component {

    static _map = new Map<string, string[]>();

    set objNode (v: Node) {
        this._objNode = v;
    }

    @property({ type: Node })
    get objNode () {
        return this._objNode;
    }

    @property({ type: Node })
    private _objNode: Node = null as any;

    @property
    command = '';

    @property
    delay = 1000;

    start () {
        const props = this.command.split('.');
        if (!this._objNode) return;
        var lh: any = this._objNode;
        var that = this;
        props.forEach((e) => {
            var last = e[e.length - 1];
            if (last == ']') {
                var i = e.indexOf('[');
                lh = lh[e.substring(0, i)];
                var str = e.substring(i);
                if (str[0] == '[') {
                    var index = str.replace('[', '').replace(']', '');
                    lh = lh[parseFloat(index)];
                }
            } else if (last == ';') {
                const ss = e.split('=');
                if (ss.length == 2) {
                    var lf: any = ss[1].trim().split(';')[0]
                    if (lf == 'false') lf = false;
                    else if (lf == '{}') lf = {};
                    else if (lf == '[]') lf = [];
                    else if (isNaN(lf)) lf = parseFloat(lf);
                    setTimeout(() => {
                        if (isValid(lh)) {
                            console.log("[COMMAND]:", lh.name, ss[0].trim(), lf);
                            lh[ss[0].trim()] = lf;
                        }
                    }, that.delay);
                }
            } else {
                lh = lh[e];
            }
        })
    }

}
