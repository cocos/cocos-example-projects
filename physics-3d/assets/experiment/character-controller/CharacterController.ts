import { _decorator, Component, Node, EAxisDirection, PhysicsSystem, director, Director, systemEvent, SystemEventType, EventKeyboard, ModelComponent, Vec3, Enum, Mesh, warn } from 'cc';
const { ccclass, property, menu } = _decorator;


// // polyhedral convex shapes
// BOX_SHAPE_PROXYTYPE,
// TRIANGLE_SHAPE_PROXYTYPE,
// TETRAHEDRAL_SHAPE_PROXYTYPE,
// CONVEX_TRIANGLEMESH_SHAPE_PROXYTYPE,
// CONVEX_HULL_SHAPE_PROXYTYPE,
// CONVEX_POINT_CLOUD_SHAPE_PROXYTYPE,
// CUSTOM_POLYHEDRAL_SHAPE_TYPE,
// //implicit convex shapes
// IMPLICIT_CONVEX_SHAPES_START_HERE,
// SPHERE_SHAPE_PROXYTYPE,
// MULTI_SPHERE_SHAPE_PROXYTYPE,
// CAPSULE_SHAPE_PROXYTYPE,
// CONE_SHAPE_PROXYTYPE,
// CONVEX_SHAPE_PROXYTYPE,
// CYLINDER_SHAPE_PROXYTYPE,
// UNIFORM_SCALING_SHAPE_PROXYTYPE,
// MINKOWSKI_SUM_SHAPE_PROXYTYPE,
// MINKOWSKI_DIFFERENCE_SHAPE_PROXYTYPE,
// BOX_2D_SHAPE_PROXYTYPE,
// CONVEX_2D_SHAPE_PROXYTYPE,
// CUSTOM_CONVEX_SHAPE_TYPE,
enum EConvexShapeType {
    BOX,
    // TETRAHEDRAL,
    // CONVEX_TRIANGLEMESH,
    // CONVEX_HULL,
    SPHERE,
    CAPSULE,
    CONE,
    CYLINDER,
}
Enum(EConvexShapeType);

const _v3_0 = new Vec3();

@ccclass('CHARACTER.ConvexShape')
class ConvexShape {
    @property({ type: EConvexShapeType })
    type: EConvexShapeType = EConvexShapeType.CAPSULE;

    /** BOX */

    @property({ type: Vec3, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.BOX } })
    get size () {
        _v3_0.set(this._data[0], this._data[1], this._data[2]);
        return _v3_0;
    }

    set size (v: Vec3) {
        this._data[0] = v.x; this._data[1] = v.y; this._data[2] = v.z;
    }

    /** CONVEX_TRIANGLEMESH */

    // @property({ type: Mesh, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.CONVEX_TRIANGLEMESH } })
    // get mesh () {
    //     return this._mesh;
    // }

    // set mesh (v: Mesh) {
    //     this._mesh = v;
    // }

    // @property
    // private _mesh: Mesh = null;

    /** SPHERE */
    /** CAPSULE */
    /** CONE */
    /** CYLINDER */

    @property({
        visible: function (this: ConvexShape) {
            return this.type == EConvexShapeType.SPHERE || this.type == EConvexShapeType.CAPSULE || this.type == EConvexShapeType.CONE || this.type == EConvexShapeType.CYLINDER;
        }
    })
    get radius () {
        return this._data[0];
    }

    set radius (v: number) {
        this._data[0] = v;
    }

    @property({
        type: EAxisDirection, visible: function (this: ConvexShape) {
            return this.type == EConvexShapeType.CAPSULE || this.type == EConvexShapeType.CONE || this.type == EConvexShapeType.CYLINDER
        }
    })
    get direction () {
        return this._data[1];
    }

    set direction (v: number) {
        this._data[1] = v;
    }

    @property({
        visible: function (this: ConvexShape) {
            return this.type == EConvexShapeType.CONE || this.type == EConvexShapeType.CYLINDER
        }
    })
    get height () {
        return this._data[2];
    }

    set height (v: number) {
        this._data[2] = v;
    }

    @property({
        visible: function (this: ConvexShape) {
            return this.type == EConvexShapeType.CAPSULE
        }
    })
    get cylinderHeight () {
        return this._data[2];
    }

    set cylinderHeight (v: number) {
        this._data[2] = v;
    }

    // /** TETRAHEDRAL */

    // @property({ type: ESimpleShapeType, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.TETRAHEDRAL } })
    // simpleType: ESimpleShapeType = ESimpleShapeType.TETRAHEDRON;

    // @property({ type: Vec3, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.TETRAHEDRAL } })
    // get vertex0 () {
    //     _v3_0.set(this._data[0], this._data[1], this._data[2]);
    //     return _v3_0;
    // }

    // set vertex0 (v: Vec3) {
    //     this._data[0] = v.x; this._data[1] = v.y; this._data[2] = v.z;
    // }

    // @property({ type: Vec3, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.TETRAHEDRAL && this.simpleType > ESimpleShapeType.VERTEX } })
    // get vertex1 () {
    //     _v3_0.set(this._data[3], this._data[4], this._data[5]);
    //     return _v3_0;
    // }

    // set vertex1 (v: Vec3) {
    //     this._data[3] = v.x; this._data[4] = v.y; this._data[5] = v.z;
    // }

    // @property({ type: Vec3, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.TETRAHEDRAL && this.simpleType > ESimpleShapeType.LINE } })
    // get vertex2 () {
    //     _v3_0.set(this._data[6], this._data[7], this._data[8]);
    //     return _v3_0;
    // }

    // set vertex2 (v: Vec3) {
    //     this._data[6] = v.x; this._data[7] = v.y; this._data[8] = v.z;
    // }

    // @property({ type: Vec3, visible: function (this: ConvexShape) { return this.type == EConvexShapeType.TETRAHEDRAL && this.simpleType > ESimpleShapeType.TRIANGLE } })
    // get vertex3 () {
    //     _v3_0.set(this._data[9], this._data[10], this._data[11]);
    //     return _v3_0;
    // }

    // set vertex3 (v: Vec3) {
    //     this._data[9] = v.x; this._data[10] = v.y; this._data[11] = v.z;
    // }

    get data () {
        return this._data;
    }

    get impl () {
        return this._btCS;
    }

    @property
    private _data: number[] = [
        0.5, 1, 1,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];

    private _btCS: Ammo.btConvexShape = null;

    initialize (node: Node) {
        if (!Vec3.equals(node.worldScale, Vec3.ONE)) {
            warn("[CHARACTER]: unsupported character scale for now");
        }
        switch (this.type) {
            case EConvexShapeType.BOX:
                const he = new Ammo.btVector3(this._data[0] / 2, this._data[1] / 2, this._data[2] / 2);
                this._btCS = new Ammo.btBoxShape(he);
                break;
            case EConvexShapeType.SPHERE:
                this._btCS = new Ammo.btSphereShape(this._data[0]);
                break;
            case EConvexShapeType.CONE:
                this._btCS = new Ammo.btConeShape(this._data[0], this._data[2]);
                (this._btCS as Ammo.btConeShape).setConeUpIndex(this._data[1]);
                break;
            case EConvexShapeType.CYLINDER:
                const he2 = new Ammo.btVector3(this._data[0], this._data[2] / 2, this._data[0]);
                this._btCS = new Ammo.btCylinderShape(he2);
                (this._btCS as Ammo.btCylinderShape).updateProp(this._data[0], this._data[2] / 2, this._data[1]);
                break;
            case EConvexShapeType.CAPSULE:
                this._btCS = new Ammo.btCapsuleShape(this._data[0], this._data[2] / 2);
                (this._btCS as Ammo.btCapsuleShape).updateProp(this._data[0], this._data[2] / 2, this._data[1])
                break;
            // case EConvexShapeType.CONVEX_TRIANGLEMESH:
            //     //TODO
            //     break;
            // case EConvexShapeType.TETRAHEDRAL:
            //     //TODO
            //     break;
            default:
                warn("[CHARACTER]: unspported convex shape type");
                break;
        }
    }

}

@ccclass('CHARACTER.CharacterController')
@menu("experiment/character-controller/CharacterController")
export class CharacterController extends Component {

    @property
    readonly USE_282 = true;

    @property
    get stepHeight () {
        return this._stepHeight;
    }

    set stepHeight (v: number) {
        this._stepHeight = v;
    }

    @property
    get walkSpeed () {
        return this._walkSpeed;
    }

    set walkSpeed (v: number) {
        this._walkSpeed = v;
    }

    @property
    get jumpSpeed () {
        return this._jumpSpeed;
    }

    set jumpSpeed (v: number) {
        this._jumpSpeed = v;
    }

    @property
    get fallSpeed () {
        return this._fallSpeed;
    }

    set fallSpeed (v: number) {
        this._fallSpeed = v;
    }

    @property
    get slopeLimit () {
        return this._slopeLimit;
    }

    set slopeLimit (v) {
        this._slopeLimit = v;
    }

    @property
    get gravity () {
        return this._gravity;
    }

    set gravity (v: number) {
        this._gravity = v;
    }

    @property({ type: EAxisDirection })
    get upAxis (): EAxisDirection {
        return this._upAxis;
    }

    set upAxis (v: EAxisDirection) {
        this._upAxis = v;
    }

    @property({ type: ConvexShape })
    readonly convexShape: ConvexShape = new ConvexShape();

    get onGround () {
        return this._btKCC.onGround();
    }

    get impl () {
        return this._btKCC;
    }

    @property
    private _stepHeight = 0.35;

    @property
    private _walkSpeed = 0.35;

    @property
    private _upAxis = EAxisDirection.Y_AXIS;

    @property
    private _slopeLimit = 45;

    @property
    private _fallSpeed = 55;

    @property
    private _jumpSpeed = 10;

    @property
    private _gravity = 9.8 * 3;

    private _index = -1;
    private _group = 1;
    private _mask = -1;

    private _btKCC: Ammo.btKinematicCharacterController;
    private _btGhostObject: Ammo.btPairCachingGhostObject;
    private _btConvexShape: Ammo.btConvexShape;
    private _walkDirection: Ammo.btVector3;
    private _quat: Ammo.btQuaternion;
    private _up: Ammo.btVector3;

    private static TEMP_BTVECTOR3;

    protected __preload () {
        if (!window.CC_PHYSICS_AMMO) return;

        if (CharacterController.TEMP_BTVECTOR3 == null)
            CharacterController.TEMP_BTVECTOR3 = new Ammo.btVector3();

        this.convexShape.initialize(this.node);
        this._btConvexShape = this.convexShape.impl;
        this._quat = new Ammo.btQuaternion(0, 0, 0, 1);
        this._btGhostObject = new Ammo.btPairCachingGhostObject();
        const co = Ammo.castObject(this._btGhostObject, Ammo.btCollisionObject);
        co['useCharacter'] = true;
        this._btGhostObject.setCollisionShape(this._btConvexShape);
        this._btGhostObject.setCollisionFlags(16);
        this._btGhostObject.setActivationState(4);
        if (this.upAxis == EAxisDirection.X_AXIS) {
            this._up = new Ammo.btVector3(1, 0, 0);
        } else if (this.upAxis == EAxisDirection.Y_AXIS) {
            this._up = new Ammo.btVector3(0, 1, 0);
        } else if (this.upAxis == EAxisDirection.Z_AXIS) {
            this._up = new Ammo.btVector3(0, 0, 1);
        }
        if (this.USE_282) {
            this._btKCC = new (Ammo as any).ccKinematicCharacterController(
                this._btGhostObject,
                this._btConvexShape,
                this.stepHeight,
                this.upAxis
            );
        } else {
            this._btKCC = new Ammo.btKinematicCharacterController(
                this._btGhostObject,
                this._btConvexShape,
                this.stepHeight,
                this._up
            );
            this.node.getComponent(ModelComponent).enabled = false;
            this.node.getComponentInChildren(ModelComponent).enabled = true;
            this._btKCC.setGravity(new Ammo.btVector3(this._up.x() * this.gravity, this._up.y() * this.gravity, this._up.z() * this.gravity));
        }
        this._btKCC.setUseGhostSweepTest(false);
        this._btKCC.setMaxSlope(this._slopeLimit / 180 * Math.PI);
        this._btKCC.setMaxJumpHeight(this._slopeLimit / 180 * Math.PI);
        this._btKCC.setFallSpeed(this.fallSpeed);
        this._btKCC.setJumpSpeed(this.jumpSpeed);
        // this.btKCC.setVelocityForTimeInterval(new Ammo.btVector3(0, 0, 0), 1);
        this._walkDirection = new Ammo.btVector3(0, 0, 0);
    }

    protected onEnable () {
        if (!window.CC_PHYSICS_AMMO) return;
        const ammoWorld = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
        ammoWorld.addCollisionObject(this._btGhostObject, this._group, this._mask);
        ammoWorld.addAction(this._btKCC);
        this._index = 1;

        director.on(Director.EVENT_BEFORE_PHYSICS, this.onBeforePhysics, this);
        director.on(Director.EVENT_AFTER_PHYSICS, this.onAfterPhysics, this);
    }

    protected onDisable () {
        if (!window.CC_PHYSICS_AMMO) return;
        director.off(Director.EVENT_BEFORE_PHYSICS, this.onBeforePhysics, this);
        director.off(Director.EVENT_AFTER_PHYSICS, this.onAfterPhysics, this);

        const ammoWorld = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
        ammoWorld.removeCollisionObject(this._btGhostObject);
        ammoWorld.removeAction(this._btKCC);
        this._index = -1;
    }

    protected onDestroy () {
        if (!window.CC_PHYSICS_AMMO) return;
        (this.convexShape as any) = null;
        Ammo.destroy(this._btConvexShape);
        Ammo.destroy(this._btKCC);
        Ammo.destroy(this._btGhostObject);
        Ammo.destroy(this._up);
        Ammo.destroy(this._quat);
        Ammo.destroy(this._walkDirection);
    }

    protected onBeforePhysics () {
        if (this.node.hasChangedFlags) this.syncSceneToPhysics();
    }

    protected syncSceneToPhysics () {
        const pos = this.node.worldPosition;
        const quat = this.node.worldRotation;
        const trans = this._btGhostObject.getWorldTransform();
        trans.getOrigin().setValue(pos.x, pos.y, pos.z);
        trans.getBasis().getRotation(this._quat);
        this._quat.setValue(quat.x, quat.y, quat.z, quat.w);
    }

    protected onAfterPhysics () {
        const trans = this._btGhostObject.getWorldTransform();
        const origin = trans.getOrigin();
        this.node.setWorldPosition(origin.x(), origin.y(), origin.z());
        trans.getBasis().getRotation(this._quat);
        this.node.setWorldRotation(this._quat.x(), this._quat.y(), this._quat.z(), this._quat.w());

        this._walkDirection.setValue(0, 0, 0);
        this._btKCC.setWalkDirection(this._walkDirection);
    }

    /**
     * 移动一段位移
     * @param translate 位移
     */
    move (translate: Vec3) {
        if (!window.CC_PHYSICS_AMMO) return;
        let x = this._walkDirection.x();
        let y = this._walkDirection.y();
        let z = this._walkDirection.z();
        this._walkDirection.setValue(x + translate.x, y + translate.y, z + translate.z);
        this._btKCC.setWalkDirection(this._walkDirection);
    }

    /**
     * `bullet2.82`版本中，设置`velocity`不起作用，调用此`API`将沿着`UP`方向跃起，速度是`jumpSpeed`。
     * 
     * `bullet2.87`版本中，如果`velocity`是零向量，将与`2.82`版本一致，否则将沿着`velocity`方向跃起，速度是`velocity`的大小。
     * @param velocity 
     */
    jump (velocity = Vec3.ZERO) {
        if (!window.CC_PHYSICS_AMMO) return;
        CharacterController.TEMP_BTVECTOR3.setValue(velocity.x, velocity.y, velocity.z);
        this._btKCC.jump(CharacterController.TEMP_BTVECTOR3);
    }

    setCollisionFilter (group: number, mask: number) {
        if (!window.CC_PHYSICS_AMMO) return;
        this._group = group; this._mask = mask;
        if (this._index != -1) {
            const ammoWorld = PhysicsSystem.instance.physicsWorld.impl as Ammo.btDiscreteDynamicsWorld;
            ammoWorld.removeCollisionObject(this._btGhostObject);
            ammoWorld.removeAction(this._btKCC);
            ammoWorld.addCollisionObject(this._btGhostObject, group, mask);
            ammoWorld.addAction(this._btKCC);
        }
    }

}
