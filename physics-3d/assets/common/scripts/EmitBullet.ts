import { _decorator, Component, Node, input, Input, Touch, EventTouch, CameraComponent, Vec3, SphereColliderComponent, RigidBodyComponent, instantiate, ModelComponent, Material, BoxColliderComponent, Primitive, CapsuleColliderComponent, CylinderColliderComponent, ConeColliderComponent, gfx, Vec4, Color } from 'cc';
const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('COMMON.EmitBullet')
@menu('common/EmitBullet')
@requireComponent(CameraComponent)
export class EmitBullet extends Component {

    @property({ type: Primitive.PrimitiveType })
    primitiveMesh = Primitive.PrimitiveType.BOX;

    @property
    strength = 10000;

    private _mesh: Primitive = null;
    private _material: Material = null;
    private _container: Node = null;
    private _bullet: Node = null;

    onLoad () {
        this._container = new Node('__EMIT_BULLET__');
        this._container.setParent(this.node.scene);

        this._material = new Material();
        this._material.initialize({
            'effectName': 'builtin-standard',
            // 'technique': 1, // Only pre-generated resources can be used
            'states': {
                'blendState': {
                    'targets': [
                        {
                            'blend': true,

                            // 'blendSrc': gfx.BlendFactor.SRC_COLOR,
                            // 'blendDst': gfx.BlendFactor.DST_COLOR,
                            // // 'blendEq': gfx.BlendOp.ADD,

                            'blendSrc': gfx.BlendFactor.SRC_ALPHA,
                            'blendDst': gfx.BlendFactor.ONE_MINUS_SRC_ALPHA,
                            'blendSrcAlpha': gfx.BlendFactor.SRC_ALPHA,
                            'blendDstAlpha': gfx.BlendFactor.ONE_MINUS_SRC_ALPHA,
                            // 'blendAlphaEq': gfx.BlendOp.ADD,
                        }
                    ]
                }
            }
        })
        this._material.setProperty('mainColor', new Color(255, 255, 255, 128));

        this._mesh = new Primitive(this.primitiveMesh);
        this._mesh.onLoaded();

        this._bullet = new Node('bullet');
        const modelCom = this._bullet.addComponent(ModelComponent);
        modelCom.mesh = this._mesh;
        modelCom.material = this._material;

        this._bullet.setWorldScale(0.25, 0.25, 0.25);
        this._bullet.addComponent(RigidBodyComponent);
        switch (this.primitiveMesh) {
            case Primitive.PrimitiveType.BOX:
                this._bullet.addComponent(BoxColliderComponent);
                break;
            case Primitive.PrimitiveType.SPHERE:
                this._bullet.addComponent(SphereColliderComponent);
                break;
            case Primitive.PrimitiveType.CAPSULE:
                if (window.CC_PHYSICS_CANNON) {
                    this._bullet.addComponent(CylinderColliderComponent);
                    const s1 = this._bullet.addComponent(SphereColliderComponent);
                    s1.center = new Vec3(0, 0.5, 0);
                    const s2 = this._bullet.addComponent(SphereColliderComponent);
                    s2.center = new Vec3(0, -0.5, 0);
                } else {
                    this._bullet.addComponent(CapsuleColliderComponent);
                }
                break;
            case Primitive.PrimitiveType.CYLINDER:
                this._bullet.addComponent(CylinderColliderComponent);
                break;
            case Primitive.PrimitiveType.CONE:
                this._bullet.addComponent(ConeColliderComponent);
                break;
            default:
                console.error("Unsupported collider type:", Primitive.PrimitiveType[this.primitiveMesh]);
                break;
        }
    }

    onEnable () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart (touch: Touch, event: EventTouch) {
        const cameraCom = this.getComponent(CameraComponent);
        const sp = touch.getLocation();
        const pos = new Vec3(sp.x, sp.y, 1);

        const target = cameraCom.screenToWorld(pos);
        const dir = Vec3.subtract(new Vec3(), target, this.node.worldPosition).normalize();
        dir.multiplyScalar(this.strength);
        const bullet = instantiate(this._bullet) as Node;
        bullet.setParent(this._container);
        bullet.setWorldPosition(this.node.worldPosition);
        bullet.getComponent(RigidBodyComponent).applyForce(dir);
    }

}
