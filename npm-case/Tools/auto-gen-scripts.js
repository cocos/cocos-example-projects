const fs = require('fs-extra');
const ps = require('path');
for (let i = 0; i < 1000; ++i) {
    const code = `
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('AutoGenMod${i}')
export class AutoGenMod${i} extends Component { }
    `;
    const file = ps.join(__dirname, '..', 'assets', 'Scripts', 'AutoGen', `Mod-${i}.ts`);
    fs.outputFileSync(file, code, { encoding: 'utf8' });
}
