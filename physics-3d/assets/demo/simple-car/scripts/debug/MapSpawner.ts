import { _decorator, Component, Node, js } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("SIMPLE-CAR.MapSpawner")
@menu("demo/simple-car/MapSpawner")
export class MapSpawner extends Component {

    private _isFinish = true;

    @property
    get spawn () {
        return !this._isFinish;
    }

    set spawn (v) {
        if (!this._isFinish) {
            return;
        }
        console.log("开始计算");
        this._isFinish = false;

        let json = [];
        for (let i = 0; i < this.node.children.length; i++) {
            const cn = this.node.children[i];

            const pefabInfo = {
                n: cn.name,
                p: cn.worldPosition,
                r: cn.worldRotation,
                s: cn.worldScale
            }

            json[i] = pefabInfo;
        }

        // save to file
        const projectPath = window.cce.project as string;
        projectPath.replace("\\", " / ");
        const fileName = this.node.name + '.json';
        const filePath = `${projectPath}/assets/resources/simple-car/map/`;
        console.log("开始生成:", fileName);
        console.log("路径:", filePath);
        const fs = window.Editor.require('fs');

        fs.exists(filePath, function (e: boolean) {
            if (!e) {
                fs.mkdir(`${projectPath}/assets/resources`, function (err: Error) {
                    if (err) console.log('创建目录失败：' + err);

                    fs.mkdir(`${projectPath}/assets/resources/simple-car`, function (err: Error) {
                        if (err) console.log('创建目录失败：' + err);

                        fs.mkdir(filePath, function (err: Error) {
                            if (err) console.log('创建目录失败：' + err)
                            else console.log('创建目录成功:', filePath);
                        });
                    });
                });
            }
        });

        const that = this;
        const content = JSON.stringify(json);
        fs.writeFile(filePath + fileName, content, (err: Error) => {
            if (err) {
                console.log("生成失败:", err);
            } else {
                console.log("完成生成");
            }
            that._isFinish = true;
        });
    }

}
