import { _decorator, Component, Node, Prefab, loader, instantiate, ICollisionEvent, ColliderComponent, game, Vec3, Quat } from 'cc';
const { ccclass, property, menu } = _decorator;
const q_0 = new Quat();
@ccclass('COMMON.ContactPointHelper')
@menu('common/ContactPointHelper')
export class ContactPointHelper extends Component {

    private static _point: Prefab = null!;
    private static _arrow: Prefab = null!;
    private static _flag = 0;
    private static _insArr: ContactPointHelper[] = [];
    private static _container: Node = null!;

    private _entityMap: Map<string, { pt: Node[], aw: Node[] }> = new Map<string, { pt: Node[], aw: Node[] }>();

    __preload () {
        if (ContactPointHelper._point == null && !(ContactPointHelper._flag & 1)) {
            ContactPointHelper._flag |= 1 << 0;
            loader.loadRes('common/prefabs/Point', Prefab, (...args) => {
                if (args) {
                    if (args[0]) {
                        console.error(args[0]);
                    } else {
                        ContactPointHelper._point = args[1] as Prefab;
                    }
                }
            });
        }
        if (ContactPointHelper._arrow == null && !(ContactPointHelper._flag & (1 << 1))) {
            ContactPointHelper._flag |= 1 << 1;
            loader.loadRes('common/prefabs/Arrow', Prefab, (...args) => {
                if (args) {
                    if (args[0]) {
                        console.error(args[0]);
                    } else {
                        ContactPointHelper._arrow = args[1] as Prefab;
                    }
                }
            });
        }
        if (ContactPointHelper._container == null) {
            ContactPointHelper._container = new Node('__CONTACT_POINT__');
            game.addPersistRootNode(ContactPointHelper._container);
        }
    }

    onLoad () {
        ContactPointHelper._insArr.push(this);
    }

    onEnable () {
        const colliders = this.getComponents(ColliderComponent);
        const that = this;
        colliders.forEach((e: ColliderComponent) => {
            e.on('onCollisionEnter', that.onCollision, that);
            e.on('onCollisionStay', that.onCollision, that);
            e.on('onCollisionExit', that.onCollision, that);
        })
    }

    onDisable () {
        const colliders = this.getComponents(ColliderComponent);
        const that = this;
        colliders.forEach((e: ColliderComponent) => {
            e.off('onCollisionEnter', that.onCollision, that);
            e.off('onCollisionStay', that.onCollision, that);
            e.off('onCollisionExit', that.onCollision, that);
        })
    }

    onCollision (event: ICollisionEvent) {
        if (ContactPointHelper._point && ContactPointHelper._arrow) {
            if (!this._entityMap.has(event.otherCollider.uuid)) this._entityMap.set(event.otherCollider.uuid, { pt: [], aw: [] });
            const map = this._entityMap.get(event.otherCollider.uuid)!;
            map.pt.forEach((e) => { e.active = false; });
            map.aw.forEach((e) => { e.active = false; });
            event.contacts.forEach((e, i) => {
                const wp = new Vec3();
                const wn = new Vec3();
                if (e.isBodyA) {
                    e.getWorldPointOnA(wp);
                    e.getWorldNormalOnB(wn);
                } else {
                    e.getWorldPointOnB(wp);
                    e.getWorldNormalOnA(wn);
                }

                let pt: Node, aw: Node;
                if (map.pt.length > i) {
                    pt = map.pt[i]; aw = map.aw[i];
                    pt.active = true; aw.active = true;
                } else {
                    pt = instantiate(ContactPointHelper._point);
                    pt.setWorldScale(0.25, 0.25, 0.25);
                    pt.setParent(ContactPointHelper._container);

                    aw = instantiate(ContactPointHelper._arrow);
                    aw.setParent(ContactPointHelper._container);

                    map.pt.push(pt);
                    map.aw.push(aw);
                }
                pt.setWorldPosition(wp);
                aw.setWorldPosition(wp);
                Quat.rotationTo(q_0, Vec3.UNIT_Z, wn);
                aw.setWorldRotation(q_0);
            })
        }
    }

    onDestroy () {
        const index = ContactPointHelper._insArr.indexOf(this);
        if (index >= 0) {
            ContactPointHelper._insArr.splice(index, 1);
        }
        this._entityMap.forEach((e: { pt: Node[], aw: Node[] }) => {
            e.pt.forEach((t) => { t.removeFromParent(); t.destroy(); })
            e.aw.forEach((b) => { b.removeFromParent(); b.destroy(); })
        })
    }
}
