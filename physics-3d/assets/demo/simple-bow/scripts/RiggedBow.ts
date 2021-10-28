
import { _decorator, Component, Node, systemEvent, SystemEventType, EventMouse, EventKeyboard, Vec3, KeyCode, RigidBody, physics, Collider, ITriggerEvent, ICollisionEvent, Quat, v3, math, PhysicsSystem, CameraComponent, geometry, Prefab, Vec2, Touch, Event, Button, Label, Canvas, sys } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('simple-bow.RiggedBow')
@menu("demo/simple-bow/RiggedBow")
export class RiggedBow extends Component {

    @property(Node)
    bone: Node = null!;

    @property(Node)
    arrow: Node = null!;

    @property(CameraComponent)
    camera: CameraComponent = null!;

    @property(Node)
    point: Node = null!;

    @property(Node)
    apple: Node = null!;

    @property
    speed = 8;

    @property
    drawBowFrames = 90;

    @property
    drawBowBackFactor = 10;

    @property
    drawBowDisplacement = 35;

    isDrawBow = false;
    isShootArrow = false;
    isShootArrowFinish = true;
    drawBowFrameCount = 0;
    boneInitPosition = new Vec3();
    boneTargetPosition = new Vec3();
    arrowInitPosition = new Vec3();
    arrowInitRotation = new Quat();
    appleInitPosition = new Vec3();
    appleInitRotation = new Quat();

    isAiming = false;
    aimDelta = new Vec3();
    appleResetState = false;
    arrowResetState = false;

    fixTimePre = 1 / 60;
    maxSubstepsPre = 1;

    @property(Node)
    buttonForMobile: Node = null!;

    @property(Node)
    labelForPC: Node = null!;

    touchStateOnMobile = 0;

    start() {
        this.labelForPC.active = !sys.isMobile;
        this.buttonForMobile.active = sys.isMobile;
        this.fixTimePre = physics.PhysicsSystem.instance.fixedTimeStep;
        this.maxSubstepsPre = physics.PhysicsSystem.instance.maxSubSteps;
        physics.PhysicsSystem.instance.fixedTimeStep = 1 / 120;
        physics.PhysicsSystem.instance.maxSubSteps = 3;
        Vec3.copy(this.boneInitPosition, this.bone.position);
        Vec3.copy(this.arrowInitPosition, this.arrow.position);
        Quat.copy(this.arrowInitRotation, this.arrow.rotation);
        Vec3.copy(this.appleInitPosition, this.apple.position);
        Quat.copy(this.appleInitRotation, this.apple.rotation);
        const body = this.arrow.getComponent(RigidBody);
        if (body) {
            body.type = physics.ERigidBodyType.KINEMATIC;
            body.useGravity = false;
            // useCCD(body);
        }
        const collider = this.arrow.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onArrowEnter, this);
            collider.on('onCollisionEnter', this.onArrowEnter, this);
        }
        const collider2 = this.apple.getComponent(Collider);
        if (collider2) {
            collider2.on('onTriggerEnter', this.onAppleEnter, this);
            collider2.on('onCollisionEnter', this.onAppleEnter, this);
        }
    }

    onDestroy() {
        physics.PhysicsSystem.instance.fixedTimeStep = this.fixTimePre;
        physics.PhysicsSystem.instance.maxSubSteps = this.maxSubstepsPre;
    }

    onEnable() {
        systemEvent.on(SystemEventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEventType.MOUSE_MOVE, this.onMouseMove, this);
        systemEvent.on(SystemEventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);

        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDisable() {
        systemEvent.off(SystemEventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.off(SystemEventType.MOUSE_MOVE, this.onMouseMove, this);
        systemEvent.off(SystemEventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEventType.KEY_UP, this.onKeyUp, this);

        systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onMouseDown(event: EventMouse) {
        this.isAiming = true;
    }

    onMouseMove(event: EventMouse) {
        this.aimDelta.set(-event.movementX / 100000, -event.movementY / 100000, 0);
    }

    onMouseUp(event: EventMouse) {
        this.isAiming = false;
    }

    onTouchStart(touch: Touch) {
        if (this.touchStateOnMobile) {
            this.isDrawBow = true;
        } else {
            this.isAiming = true;
        }
    }

    onTouchMove(touch: Touch) {
        if (!this.touchStateOnMobile) {
            const delta = touch.getDelta();
            this.aimDelta.set(-delta.x / 100000, delta.y / 100000, 0);
        }
    }

    onTouchEnd(touch: Touch) {
        if (this.touchStateOnMobile) {
            this.isDrawBow = false;
        } else {
            this.isAiming = false;
        }
    }

    onClickBtn(event: Event) {
        const node = event.target as Node;
        const buttonLab = node.getComponentsInChildren(Label)[0];
        if (buttonLab.string == "Aiming") {
            buttonLab.string = "Pull Bow";
            this.touchStateOnMobile = 1;
        } else {
            buttonLab.string = "Aiming";
            this.touchStateOnMobile = 0;
        }
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.SPACE) {
            this.isDrawBow = true;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.SPACE) {
            this.isDrawBow = false;
        }
    }

    onAppleEnter(event: ITriggerEvent | ICollisionEvent) {
        if (event.otherCollider.node.name == "TriggerArea") {
            if (this.appleResetState) return;
            this.appleResetState = true;
            const that = this;
            setTimeout(() => {
                if (!that.isValid) return;
                that.appleResetState = false;
                that.apple.position = that.appleInitPosition;
                that.apple.rotation = that.appleInitRotation;
                const body = that.apple.getComponent(RigidBody);
                if (body) body.clearState();
            }, 2000);
        }
    }

    onArrowEnter(event: ITriggerEvent | ICollisionEvent) {
        if (event.otherCollider.node.name == "TriggerArea") {
            if (this.arrowResetState) return;
            this.arrowResetState = true;
            const that = this;
            setTimeout(() => {
                if (!that.isValid) return;
                that.arrowResetState = false;
                that.isShootArrowFinish = true;
                const body = that.arrow.getComponent(RigidBody);
                if (body) {
                    body.type = physics.ERigidBodyType.KINEMATIC;
                    body.useGravity = false;
                }
                that.arrow.position = that.arrowInitPosition;
                that.arrow.rotation = that.arrowInitRotation;
            }, 2000);
        } else {
            if (event.otherCollider.node.name == "RedApple") {
                const body = this.arrow.getComponent(RigidBody);
                if (body) body.useGravity = true;
            } else {
                const body = this.arrow.getComponent(RigidBody);
                if (body) body.useGravity = true;
            }
        }
    }

    update(deltaTime: number) {
        if (this.isShootArrowFinish && this.isAiming) {
            this.node.translate(this.aimDelta, Node.NodeSpace.WORLD);
        }

        if (this.isShootArrowFinish) {
            //is draw the bow
            if (this.isDrawBow) {
                this.drawBowFrameCount = math.clamp(this.drawBowFrameCount + 1, 0, this.drawBowFrames);
                const percent = math.clamp01(this.drawBowFrameCount / this.drawBowFrames);
                const dir = Vec3.transformQuat(new Vec3(), Vec3.UNIT_Z, this.bone.worldRotation);
                Vec3.scaleAndAdd(this.boneTargetPosition, this.boneInitPosition, dir, percent * this.drawBowDisplacement);
                this.bone.position = this.boneTargetPosition;
            } else {
                if (this.drawBowFrameCount > 0) {
                    this.drawBowFrameCount -= this.drawBowFrames / this.drawBowBackFactor;
                    if (this.drawBowFrameCount <= 0) {
                        this.bone.position = this.boneInitPosition;
                        this.drawBowFrameCount = 0;
                        this.isShootArrow = true;
                    } else {
                        const percent = math.clamp01(this.drawBowFrameCount / this.drawBowFrames);
                        const dir = Vec3.transformQuat(new Vec3(), Vec3.UNIT_Z, this.bone.worldRotation);
                        Vec3.scaleAndAdd(this.boneTargetPosition, this.boneInitPosition, dir, percent * this.drawBowDisplacement);
                        this.bone.position = this.boneTargetPosition;
                    }
                }
            }

            //is shoot the arrow
            if (this.isShootArrow) {
                this.isShootArrow = false;
                this.isShootArrowFinish = false;
                // this.arrow.parent = this.node.parent;
                const body = this.arrow.getComponent(RigidBody);
                if (body) {
                    body.type = physics.ERigidBodyType.DYNAMIC;
                    const dir = new Vec3();
                    Vec3.transformQuat(dir, Vec3.UNIT_Y, this.arrow.worldRotation);
                    Vec3.negate(dir, dir);
                    Vec3.multiplyScalar(dir, dir, this.speed);
                    body.setLinearVelocity(dir);
                }
            } else {
                // point
                const ray = new geometry.Ray();
                const dir = new Vec3();
                Vec3.transformQuat(dir, Vec3.UNIT_Y, this.arrow.worldRotation);
                Vec3.negate(dir, dir);
                Vec3.copy(ray.o, this.arrow.worldPosition);
                Vec3.copy(ray.d, dir);
                if (PhysicsSystem.instance.raycastClosest(ray, 0b10)) {
                    const r = PhysicsSystem.instance.raycastClosestResult;
                    this.point.worldPosition = r.hitPoint;
                }
            }
        }
    }
}

function useCCD(rb: RigidBody, ms = 0.001, sr = 0.05) {
    if (rb && PhysicsSystem.PHYSICS_AMMO) {
        const Ammo = window['Ammo'];
        const impl = rb.body!.impl;
        impl['useCCD'] = true;
        const co = Ammo.castObject(impl, Ammo.btCollisionObject) as any;
        co['wrapped'] = rb.body;
        co['useCCD'] = true;
        impl.setCcdMotionThreshold(ms);
        impl.setCcdSweptSphereRadius(sr);
    }
}
