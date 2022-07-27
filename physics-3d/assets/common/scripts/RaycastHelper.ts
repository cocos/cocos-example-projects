import { _decorator, Component, Node, Prefab, loader, input, Touch, geometry, CameraComponent, PhysicsSystem, Enum, KeyCode, EventKeyboard, game, Input } from 'cc';
import { PrefabPoolUtil } from './PrefabPoolUtil';
const { ccclass, property, menu } = _decorator;

enum ERaycastType {
    ALL,
    CLOSEST,
}
Enum(ERaycastType);

enum EKey {
    r = KeyCode.KEY_R,
    g = KeyCode.KEY_G,
    b = KeyCode.KEY_B,
}
Enum(EKey);

@ccclass('COMMON.RaycastHelper')
@menu('common/RaycastHelper')
export class RaycastHelper extends Component {

    private static _point: Prefab = null!;
    private static _enable = false;
    private static _container = new Node("_RAYCAST_CONTAINER_");

    private _cache: Node[] = [];

    @property({ type: CameraComponent })
    cameraCom: CameraComponent = null!;

    @property({ type: ERaycastType })
    raycastType: ERaycastType = ERaycastType.CLOSEST;

    @property({
        type: EKey,
        tooltip: "开关，控制全局",
    })
    switch: number = KeyCode.KEY_R;

    @property
    scale: number = 1;

    __preload () {
        if (RaycastHelper._point == null) {
            loader.loadRes('common/prefabs/Point', Prefab, (...args) => {
                if (args) {
                    if (args[0]) {
                        console.error(args[0]);
                    } else {
                        RaycastHelper._point = args[1] as Prefab;
                        RaycastHelper._enable = true;
                    }
                }
            });
        }
        game.addPersistRootNode(RaycastHelper._container);
    }

    onEnable () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDisable () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy () {
        this.recover();
    }

    onKeyDown (event: EventKeyboard) {
        if (event.keyCode == this.switch) {
            RaycastHelper._enable = !RaycastHelper._enable;
        }
    }

    onTouchStart (touch: Touch) {
        if (!RaycastHelper._enable) return;
        this.recover();
        const r = new geometry.Ray();
        const p = touch.getLocation();
        this.cameraCom.screenPointToRay(p.x, p.y, r);
        if (this.raycastType == ERaycastType.CLOSEST) {
            if (PhysicsSystem.instance.raycastClosest(r)) {
                const result = PhysicsSystem.instance.raycastClosestResult;
                const clone = PrefabPoolUtil.getItemByPoolName('COMMON.Point', RaycastHelper._point) as Node;
                this._cache.push(clone);
                clone.setWorldPosition(result.hitPoint);
                clone.setScale(this.scale, this.scale, this.scale);
                RaycastHelper._container.addChild(clone);
            }
        } else if (this.raycastType == ERaycastType.ALL) {
            if (PhysicsSystem.instance.raycast(r)) {
                const results = PhysicsSystem.instance.raycastResults;
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    const clone = PrefabPoolUtil.getItemByPoolName('COMMON.Point', RaycastHelper._point) as Node;
                    this._cache.push(clone);
                    clone.setWorldPosition(result.hitPoint);
                    clone.setScale(this.scale, this.scale, this.scale);
                    RaycastHelper._container.addChild(clone);
                }
            }
        }
    }

    recover () {
        let len = this._cache.length;
        while (len--) {
            PrefabPoolUtil.recoverItemByPoolName('COMMON.Point', this._cache.pop()!, true);
        }
    }

}
