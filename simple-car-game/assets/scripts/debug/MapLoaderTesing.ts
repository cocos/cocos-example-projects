import { _decorator, Component, Node, JsonAsset, instantiate, loader, Prefab, Vec3, Quat, systemEvent } from "cc";
const { ccclass, property, menu } = _decorator;

@ccclass("MapLoaderTesing")
@menu("Tesing/MapLoaderTesing")
export class MapLoaderTesing extends Component {

    @property({ type: JsonAsset })
    jsonAsset: JsonAsset = null;

    _isLoading = false;

    @property
    get load () {
        return this._isLoading;
    }

    set load (v) {
        if (this._isLoading) {
            return;
        }
        this._isLoading = true;

        if (this.jsonAsset) {
            const map = this.jsonAsset.json as IMapStruct[];
            let cur = 0;
            const tol = map.length;
            for (let i = 0; i < map.length; i++) {
                const prefabInfo = map[i];
                loader.loadRes('prefabs/mapItem/' + prefabInfo.n, Prefab, (...args) => {
                    if (args) {
                        if (args[0]) {
                            console.error(args[0]);
                        } else {
                            const prefab = args[1] as Prefab;
                            const clone = instantiate(prefab) as Node;
                            this.node.addChild(clone);
                            clone.setWorldPosition(prefabInfo.p as Vec3);
                            clone.setWorldRotation(prefabInfo.r as Quat);
                            clone.setWorldScale(prefabInfo.s as Vec3);
                        }
                    }
                    cur++;
                    if (cur == tol) {
                        systemEvent.emit('onMapLoaded');
                    }
                });
            }
        }

        this._isLoading = false;
    }

    start () {
        this.load = true;
    }

}
