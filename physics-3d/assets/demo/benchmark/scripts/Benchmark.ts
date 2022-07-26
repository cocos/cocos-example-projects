import { _decorator, Component, Node, Prefab, instantiate, Vec2, EventTouch, EditBox, Vec3, randomRange, random, LabelComponent, Quat, Toggle, PhysicsSystem, profiler, RigidBodyComponent, director, Director, math } from "cc";
import { ProfilerManager } from "../../../common/scripts/ProfilerManager";
const { ccclass, property, menu } = _decorator;

export const KEY_INIT_STR = "KEY_INIT_STR";
const v3_0 = new Vec3(0, 3, 0);

@ccclass("BENCHMARK.Benchmark")
@menu("demo/benchmark/Benchmark")
export class Benchmark extends Component {

    /** PREFAB */

    @property({ type: Prefab })
    readonly box: Prefab = null!;

    @property({ type: Prefab })
    readonly sphere: Prefab = null!;

    @property({ type: Prefab })
    readonly boxRB: Prefab = null!;

    @property({ type: Prefab })
    readonly sphereRB: Prefab = null!;

    /** CONTAINER */

    @property({ type: Node })
    readonly boxContainer: Node = null!;

    @property({ type: Node })
    readonly sphereContainer: Node = null!;

    @property({ type: Node })
    readonly boxRBContainer: Node = null!;

    @property({ type: Node })
    readonly sphereRBContainer: Node = null!;

    /** RANGE */

    @property
    readonly rangeY = new Vec2(10, 100);

    @property
    readonly rangeXZ = new Vec2(-50, 50);

    @property
    readonly rangeSize = new Vec2(0.5, 5);

    /** LEFT */

    @property({ type: EditBox })
    readonly l_editBox: EditBox = null!;

    @property({ type: LabelComponent })
    readonly l_current: LabelComponent = null!;

    /** RIGHT */

    @property({ type: Toggle })
    readonly r_rotateToggle: Toggle = null!;

    @property({ type: EditBox })
    readonly r_frameRateEditBox: EditBox = null!;

    @property({ type: EditBox })
    readonly r_subStepEditBox: EditBox = null!;

    @property({ type: EditBox })
    readonly r_IntervalEditBox: EditBox = null!;

    @property({ type: RigidBodyComponent })
    readonly rotateDynamics: RigidBodyComponent = null!;

    private initBoxCount: number = 0;
    private initSphereCount: number = 0;
    private initBoxRBCount: number = 0;
    private initSphereRBCount: number = 0;

    private intervalCurrent: number = 0;
    private intervalNumber: number = 0;

    private enableRotate = true;

    start() {
        this.node.addComponent(ProfilerManager);

        const item = localStorage.getItem(KEY_INIT_STR);
        let value = '';
        if (item != null && item != '') {
            this.l_editBox.string = value = item;
        } else {
            value = this.l_editBox.string;
        }

        if (value != '') {
            const arr = value.split('-');
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    const count = parseInt(arr[i]);
                    if (isNaN(count)) continue;

                    switch (i) {
                        case 0: this.initBoxCount = count; break;
                        case 1: this.initSphereCount = count; break;
                        case 2: this.initBoxRBCount = count; break;
                        case 3: this.initSphereRBCount = count; break;
                    }
                }
            }
        }

        this.l_current.string = "目前数量：" + this.initBoxCount + "-" + this.initSphereCount + "-" + this.initBoxRBCount + "-" + this.initSphereRBCount;
        this.instantiate(this.initBoxCount, this.box, this.boxContainer);
        this.instantiate(this.initSphereCount, this.sphere, this.sphereContainer);
        this.instantiate(this.initBoxRBCount, this.boxRB, this.boxRBContainer);
        this.instantiate(this.initSphereRBCount, this.sphereRB, this.sphereRBContainer);

        this.onRotateToggole(this.r_rotateToggle);
        this.onEditFrameRate(this.r_frameRateEditBox);
        this.onEditSubStep(this.r_subStepEditBox);
        this.onEditInterval(this.r_IntervalEditBox);

        PhysicsSystem.instance.resetAccumulator(0);
    }

    update() {
        if (this.intervalCurrent == 0) {
            PhysicsSystem.instance.enable = true;
            this.intervalCurrent = this.intervalNumber;
        } else {
            this.intervalCurrent--;
            PhysicsSystem.instance.enable = false;
        }

        if (this.enableRotate)
            this.rotateDynamics.setAngularVelocity(v3_0);
        else
            this.rotateDynamics.setAngularVelocity(Vec3.ZERO as Vec3);
    }

    onDestroy() {
        PhysicsSystem.instance.enable = true;
        PhysicsSystem.instance.fixedTimeStep = 1 / 60;
        PhysicsSystem.instance.maxSubSteps = 1;
        PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
    }

    private instantiate(count: number, prefab: Prefab, container: Node) {
        for (let i = 0; i < count; i++) {
            this.instantiateSingle(prefab, container);
        }
    }

    private instantiateSingle(prefab: Prefab, container: Node) {
        const entity = instantiate(prefab) as Node;
        this.resetTransformSingle(entity);
        container.addChild(entity);
        this.updateCurrentLab();
    }

    private resetTransforms() {
        for (let i = 0; i < this.boxContainer.children.length; i++) {
            const entity = this.boxContainer.children[i];
            this.resetTransformSingle(entity);
        }

        for (let i = 0; i < this.sphereContainer.children.length; i++) {
            const entity = this.sphereContainer.children[i];
            this.resetTransformSingle(entity);
        }

        for (let i = 0; i < this.boxRBContainer.children.length; i++) {
            const entity = this.boxRBContainer.children[i];
            this.resetTransformSingle(entity);
        }

        for (let i = 0; i < this.sphereRBContainer.children.length; i++) {
            const entity = this.sphereRBContainer.children[i];
            this.resetTransformSingle(entity);
        }
    }

    private resetTransformSingle(entity: Node) {
        let y = randomRange(this.rangeY.x, this.rangeY.y);
        let x = randomRange(this.rangeXZ.x, this.rangeXZ.y);
        let z = randomRange(this.rangeXZ.x, this.rangeXZ.y);
        entity.setWorldPosition(x, y, z);
        x = randomRange(0, 360);
        y = randomRange(0, 360);
        z = randomRange(0, 360);
        entity.setRotationFromEuler(x, y, z);
        if (Math.random() > 0.3) {
            x = randomRange(this.rangeSize.x, this.rangeSize.y);
            y = randomRange(this.rangeSize.x, this.rangeSize.y);
            z = randomRange(this.rangeSize.x, this.rangeSize.y);
            if (entity.name == "Sphere" || entity.name == "Sphere-RB") {
                entity.setWorldScale(x, x, x);
            } else {
                entity.setWorldScale(x, y, z);
            }
        }
    }

    private updateCurrentLab() {
        const a = this.boxContainer.children.length;
        const b = this.sphereContainer.children.length;
        const c = this.boxRBContainer.children.length;
        const d = this.sphereRBContainer.children.length;
        this.l_current.string = "目前数量：" + a + "-" + b + "-" + c + "-" + d;
    }

    onAddBox(touch: EventTouch, custom?: string) {
        this.instantiate(5, this.box, this.boxContainer);
    }

    onAddSphere(touch: EventTouch, custom?: string) {
        this.instantiate(5, this.sphere, this.sphereContainer);
    }

    onAddBoxRB(touch: EventTouch, custom?: string) {
        this.instantiate(5, this.boxRB, this.boxRBContainer);
    }

    onAddSphereRB(touch: EventTouch, custom?: string) {
        this.instantiate(5, this.sphereRB, this.sphereRBContainer);
    }

    onEditFinish(editBox: EditBox) {
        const str = editBox.string;
        if (str != '') {
            localStorage.setItem(KEY_INIT_STR, str);
        }
    }

    onReset(touch: EventTouch, custom?: string) {
        this.resetTransforms();
    }

    onRotateToggole(toggle: Toggle) {
        this.enableRotate = toggle.isChecked;
    }

    onEditFrameRate(editBox: EditBox) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        let fr = math.clamp(v, 30, 300);
        editBox.string = fr + '';
        PhysicsSystem.instance.fixedTimeStep = 1 / fr;
    }

    onEditSubStep(editBox: EditBox) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        if (v >= 0) {
            PhysicsSystem.instance.maxSubSteps = v;
        }
    }

    onEditInterval(editBox: EditBox) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        if (v >= 0) {
            this.intervalNumber = v;
        }
    }
}
