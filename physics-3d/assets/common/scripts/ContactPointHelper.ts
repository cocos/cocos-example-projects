import { _decorator, Component, Node, Prefab, loader, instantiate, ICollisionEvent, ColliderComponent, game, Vec3, Quat, Pool, LabelComponent, CCInteger } from 'cc';
const { ccclass, property, menu } = _decorator;
const q_0 = new Quat();

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

    private _entityMap: Map<string, { pt: Node[], aw: Node[] }> = new Map<string, { pt: Node[], aw: Node[] }>();

    private originPoolSize = 4;

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

            const infFar = new Vec3(999999, 999999, 999999);
            pt.setWorldPosition(infFar);
            aw.setWorldPosition(infFar);

            return { pt, aw };
        }, originPoolSize);

        const colliders = this.getComponents(ColliderComponent);

        colliders.forEach((e: ColliderComponent) => {
            if (!this._entityMap.has(e.uuid)) this._entityMap.set(e.uuid, { pt: [], aw: [] });
            const map = this._entityMap.get(e.uuid)!;
            const pts = map.pt;
            const aws = map.aw;
            for (let i = 0; i < originPoolSize; i++) {
                const p = this._pool!.alloc();
                pts.push(p.pt);
                aws.push(p.aw);
            }
        });
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
            const map = this._entityMap.get(event.selfCollider.uuid)!;
            const pts = map.pt;
            const aws = map.aw;

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
                    const marker = this._pool!.alloc();
                    pt = marker.pt;
                    aw = marker.aw;

                    pt.setWorldScale(0.25, 0.25, 0.25);
                    pt.setParent(ContactPointHelper._container);

                    aw = instantiate(this.arrow);
                    aw.setParent(ContactPointHelper._container);

                    map.pt.push(pt);
                    map.aw.push(aw);
                }

                pt.setWorldPosition(wp);
                aw.setWorldPosition(wp);
                Quat.rotationTo(q_0, Vec3.UNIT_Z, wn);
                aw.setWorldRotation(q_0);
            })

            const pool_size = pts.length;
            const infFar = new Vec3(999999, 999999, 999999);
            for (let i = event.contacts.length; i < pool_size; i++) {
                pts[i].setWorldPosition(infFar);
                aws[i].setWorldPosition(infFar);
            }
        }
    }

    onDestroy() {
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
