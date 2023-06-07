import { _decorator, Component, Node, Prefab, loader, instantiate, ICollisionEvent, ColliderComponent, game, Vec3, Quat, Pool, LabelComponent, CCInteger } from 'cc';
const { ccclass, property, menu } = _decorator;
const q_0 = new Quat();
const infFar = new Vec3(999999, 999999, 999999);

interface primitive {
    pt: Node;
    aw: Node;
};

@ccclass('COMMON.ContactPointHelper')
@menu('common/ContactPointHelper')
export class ContactPointHelper extends Component {

    @property({ type: Prefab })
    public point: Prefab = null as any;

    @property({ type: Prefab })
    public arrow: Prefab = null as any;

    private static _insArr: ContactPointHelper[] = [];

    private static _container: Node = null!;

    private _pool: Pool<primitive> | null = null;

    private _entityMap: Map<string, { markers: primitive[] }> = new Map<string, { markers: primitive[] }>();

    private originPoolSize = 10;

    __preload() {
        if (ContactPointHelper._container == null) {
            ContactPointHelper._container = new Node('__CONTACT_POINT__');
            game.addPersistRootNode(ContactPointHelper._container);
        }

        const originPoolSize = this.originPoolSize;

        // init pool
        this._pool = new Pool<primitive>(() => {
            if (this.point == null || this.arrow == null) {
                console.error('ContactPointHelper: point or arrow is null');
            }

            const pt = instantiate(this.point);
            pt.setWorldScale(0.25, 0.25, 0.25);
            pt.setParent(ContactPointHelper._container);

            const aw = instantiate(this.arrow);
            aw.setParent(ContactPointHelper._container);

            pt.active = true;
            aw.active = true;

            pt.setWorldPosition(infFar);
            aw.setWorldPosition(infFar);

            return { pt, aw };
        },
        originPoolSize);
    }

    onLoad() {
        ContactPointHelper._insArr.push(this);
    }

    onEnable() {
        const colliders = this.getComponents(ColliderComponent);

        const that = this;
        colliders.forEach((e: ColliderComponent) => {
            e.on('onCollisionEnter', that.onCollision, that);
            e.on('onCollisionStay', that.onCollision, that);
            e.on('onCollisionExit', that.onCollision, that);
        })
    }

    onDisable() {
        const colliders = this.getComponents(ColliderComponent);
        const that = this;
        colliders.forEach((e: ColliderComponent) => {
            e.off('onCollisionEnter', that.onCollision, that);
            e.off('onCollisionStay', that.onCollision, that);
            e.off('onCollisionExit', that.onCollision, that);
        })
    }

    onCollision(event: ICollisionEvent) {
        if (this.point && this.arrow) {
            if (!this._entityMap.has(event.otherCollider.uuid)) this._entityMap.set(event.otherCollider.uuid, { markers: [] });
            const map = this._entityMap.get(event.otherCollider.uuid)!;
            const markers = map.markers;

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

                let marker: primitive;

                if (markers.length > i) {
                    marker = markers[i];
                } else {
                    marker = this._pool!.alloc();
                    markers.push(marker);
                }

                marker.pt.setWorldPosition(wp);
                marker.aw.setWorldPosition(wp);
                Quat.rotationTo(q_0, Vec3.UNIT_Z, wn);
                marker.aw.setWorldRotation(q_0);
            });

            const pool_size = markers.length;
            for (let i = event.contacts.length; i < pool_size; i++) {
                markers[i].pt.setWorldPosition(infFar);
                markers[i].aw.setWorldPosition(infFar);
            }
        }
    }

    onDestroy() {
        const index = ContactPointHelper._insArr.indexOf(this);
        if (index >= 0) {
            ContactPointHelper._insArr.splice(index, 1);
        }
        this._entityMap.forEach((e: { markers: primitive[] }) => {
            e.markers.forEach((t) => {
                t.pt.removeFromParent();
                t.aw.removeFromParent();
                t.pt.destroy();
                t.aw.destroy();
            })
        })
    }
}
