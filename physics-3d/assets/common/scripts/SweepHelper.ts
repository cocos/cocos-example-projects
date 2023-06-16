import { _decorator, Component, Node, CameraComponent, PhysicsSystem, Enum, Vec3, Primitive, 
    MeshRenderer, instantiate, Material, Color, Quat, director, EditBox, Label, LabelComponent, physics, geometry, quat } from 'cc';
import { v3_t } from '../../demo/falling-ball/scripts/TempConst';
const { ccclass, property, menu } = _decorator;

enum ESweepType {
    ALL,
    CLOSEST,
}
Enum(ESweepType);

enum ESweepShapeType {
    BOX,
    SPHERE,
    CAPSULE
}
Enum(ESweepShapeType);

const DEFAULT_HIT_POINT_NUMBER = 100;
const DefaultHitPointWorldPos = new Vec3(-100000,-100000,-100000);
@ccclass('COMMON.SweepHelper')
@menu('common/SweepHelper')
export class SweepHelper extends Component {

    @property({ type: CameraComponent })
    cameraCom: CameraComponent = null!;

    // private controlPointContainer = new Node("controlPointContainer");
    private hitPointContainer = new Node("hitPointContainer");
    private lineSegmentContainer = new Node("lineSegmentContainer");
    private _lineSegment: Node  = new Node('lineSegment');
    private _hitPoint: Node  = new Node('hitPoint');
    private _sweepBox: Node  = new Node('sweepBox');
    private _sweepSphere: Node  = new Node('sweepSphere');
    private _sweepCapsule: Node  = new Node('sweepCapsule');

    public CurveOrigin: Vec3 = new Vec3(-9,0,0);
    // public StartPointX: number = 0;
    public StartPointY: number = 1;
    public StartPointZ: number = 0;
    public StartPointDistance: number = 0;
    public StartPointHeight: number = 0;
    public ControlPointDistance: number = 9;
    public ControlPointHeight: number = 2;
    public EndPointDistance: number = 18;
    public EndPointHeight: number = 0;
    public SampleNumnber: number = 30;

    private sweepType: ESweepType = ESweepType.ALL; 
    private sweepShapeType: ESweepShapeType = ESweepShapeType.BOX; 
    private hitSphereScale: number = 0.2;
    private controlPointScale: number = 0.2;

    private _boxHalfExtents = new Vec3(0.5, 0.5, 0.5);
    private _sphereRadius = 0.5;
    private _capsuleRadius = 0.5;
    private _capsuleHeight = 1;
    private _scale = 1;
    private _rotation = new Vec3(0,0,0);
    private _orientation = new Quat();
    private _ray: geometry.Ray = new geometry.Ray();
    private _maxDistance: number = 30;
    private _mask: number = 0xffffffff;
    private _queryTrigger = true;

    private ResultLabel: any;

    private _hitPointPool: Node[] = [];
    
    __preload () {
        this.ResultLabel = this.node.scene.getChildByName('Canvas')!.getChildByName('Result')!.getComponent(LabelComponent)!;

        this._sweepBox = this.node.scene.getChildByName('SweepShape')!.getChildByName('Cube')!;
        this._sweepSphere = this.node.scene.getChildByName('SweepShape')!.getChildByName('Sphere')!;
        this._sweepCapsule = this.node.scene.getChildByName('SweepShape')!.getChildByName('Capsule')!;

        //init hit point node
        const hitPointMaterial = new Material();
        hitPointMaterial.initialize({
            'effectName': 'builtin-standard'
        })
        hitPointMaterial.setProperty('mainColor', new Color(200, 0, 0, 255));
        let hitPointMesh = new Primitive(Primitive.PrimitiveType.BOX);//SPHERE is not working
        hitPointMesh.onLoaded();
        const _hitPointRenderCom = this._hitPoint.addComponent(MeshRenderer);
        _hitPointRenderCom.mesh = hitPointMesh;
        _hitPointRenderCom.material = hitPointMaterial;
        director.addPersistRootNode(this.hitPointContainer);

        //init lineSegment node
        const lineSegmentMaterial = new Material();
        lineSegmentMaterial.initialize({
            'effectName': 'builtin-standard'
        })
        lineSegmentMaterial.setProperty('mainColor', new Color(200, 0, 0, 255));
        let mesh = new Primitive(Primitive.PrimitiveType.BOX);
        mesh.onLoaded();
        let temoNode = new Node();
        temoNode.setParent(this._lineSegment);
        temoNode.setPosition(new Vec3(0,0.5,0));
        const modelCom = temoNode.addComponent(MeshRenderer);
        modelCom.mesh = mesh;
        modelCom.material = lineSegmentMaterial;
        director.addPersistRootNode(this.lineSegmentContainer);

        this.generateSegments(this.SampleNumnber, this.sweepShapeType);

        //init hit point pool
        for(let i = 0; i < DEFAULT_HIT_POINT_NUMBER; i++){
            const hitPoint = instantiate(this._hitPoint) as Node;
            hitPoint.setWorldPosition(DefaultHitPointWorldPos);
            this._hitPointPool.push(hitPoint);
            this.hitPointContainer.addChild(hitPoint);
        }
    }

    onLoad() {
    }

    start(){
        this.OnCurveCast ();
    }

    onDestroy () {
        this.hitPointContainer.removeAllChildren();
        this.lineSegmentContainer.removeAllChildren();
        this._hitPointPool.length = 0;
    }
    
    sampleLine(p0:Vec3, p1:Vec3, t: number):Vec3 {
        let ret = new Vec3(0);
        //ret = p0 + (p1 - p0) * t
        let ret1 = new Vec3(0);
        Vec3.subtract(ret1, p1, p0);
        Vec3.multiplyScalar(ret1, ret1, t);
        Vec3.add(ret, p0, ret1);
        return ret;
    }

    getHitPoint () {
        let hitPoint = null;
        if(this._hitPointPool.length > 0){
            hitPoint = this._hitPointPool.pop();
        } else{
            hitPoint = instantiate(this._hitPoint) as Node;
            this.hitPointContainer.addChild(hitPoint);
        }
        return hitPoint;
    }

    putHitPoint (hitPoint: Node) {
        if (!hitPoint) return;
        hitPoint.setWorldPosition(DefaultHitPointWorldPos);
        this._hitPointPool.push(hitPoint);
    }

    resetHitPointContainer () {
        for(let i = 0 ; i < this.hitPointContainer.children.length; i++){
            const hitPoint = this.hitPointContainer.children[i];
            this.putHitPoint(hitPoint);
        }
    }

    OnCurveCast () {
        this._ray = new geometry.Ray(-9, this.StartPointY, this.StartPointZ, 1, 0, 0);
        //convert rotation to orientation
        Quat.fromEuler(this._orientation, this._rotation.x, this._rotation.y, this._rotation.z);

        this.ResultLabel.string = "";

        this.resetHitPointContainer();

        let sampleArray = [];
        let p1 = new Vec3();
        this._ray.computeHit(p1, this._maxDistance);
        for(let s = 0; s < this.SampleNumnber; s++){
            let samplePos = this.sampleLine(this._ray.o, p1, s/(this.SampleNumnber-1));
            sampleArray.push(samplePos);
        }

        //let sampleDir = new Vec3();
        for(let s = 0; s < this.SampleNumnber; s++){
            const lineSegment = this.lineSegmentContainer.children[s];
            let samplePos = sampleArray[s];
            
            lineSegment.setWorldPosition(samplePos);
            // let scale = new Vec3(0.05, length, 0.05);
            lineSegment.setWorldScale(this._scale, this._scale, this._scale);
            lineSegment.setWorldRotation(this._orientation);
        }
        

        if (this.sweepType == ESweepType.CLOSEST) {
            switch (this.sweepShapeType) {
                case ESweepShapeType.BOX:
                    v3_t.set(this._boxHalfExtents.x, this._boxHalfExtents.y, this._boxHalfExtents.z);
                    Vec3.multiplyScalar(v3_t, v3_t, this._scale);
                    if (PhysicsSystem.instance.sweepBoxClosest(this._ray, v3_t, this._orientation, this._mask, this._maxDistance, this._queryTrigger)) {
                        const result = PhysicsSystem.instance.sweepCastClosestResult;
                        const hitPoint = this.getHitPoint();
                        if(hitPoint) {
                            hitPoint.setWorldPosition(result.hitPoint);
                            hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                        }
                    }
                    break;
                case ESweepShapeType.SPHERE:
                    if (PhysicsSystem.instance.sweepSphereClosest(this._ray, this._sphereRadius * this._scale, this._mask, this._maxDistance, this._queryTrigger)) {
                        const result = PhysicsSystem.instance.sweepCastClosestResult;
                        const hitPoint = this.getHitPoint();
                        if(hitPoint) {
                            hitPoint.setWorldPosition(result.hitPoint);
                            hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                        }
                    }
                    break;
                case ESweepShapeType.CAPSULE:
                    if (PhysicsSystem.instance.sweepCapsuleClosest(this._ray, this._capsuleRadius * this._scale, this._capsuleHeight * this._scale, this._orientation, this._mask, this._maxDistance, this._queryTrigger)) {
                        const result = PhysicsSystem.instance.sweepCastClosestResult;
                        const hitPoint = this.getHitPoint();
                        if(hitPoint) {
                            hitPoint.setWorldPosition(result.hitPoint);
                            hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                        }
                    }
                    break;
            }
        } else if (this.sweepType == ESweepType.ALL) {
            switch (this.sweepShapeType) {
                case ESweepShapeType.BOX:
                    v3_t.set(this._boxHalfExtents.x, this._boxHalfExtents.y, this._boxHalfExtents.z);
                    Vec3.multiplyScalar(v3_t, v3_t, this._scale);
                    if (PhysicsSystem.instance.sweepBox(this._ray, v3_t, this._orientation, this._mask, this._maxDistance, this._queryTrigger)) {
                        const results = PhysicsSystem.instance.sweepCastResults;
                        for (let i = 0; i < results.length; i++) {
                            const result = results[i];
                            const hitPoint = this.getHitPoint();
                            if(hitPoint) {
                                hitPoint.setWorldPosition(result.hitPoint);
                                hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                            }
                        }
                    }
                    break;
                case ESweepShapeType.SPHERE:
                    if (PhysicsSystem.instance.sweepSphere(this._ray, this._sphereRadius * this._scale, this._mask, this._maxDistance, this._queryTrigger)) {
                        const results = PhysicsSystem.instance.sweepCastResults;

                        for (let i = 0; i < results.length; i++) {
                            const result = results[i];
                            const hitPoint = this.getHitPoint();
                            if(hitPoint) {
                                hitPoint.setWorldPosition(result.hitPoint);
                                hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                            }
                        }
                    }
                    break;
                case ESweepShapeType.CAPSULE:
                    if (PhysicsSystem.instance.sweepCapsule(this._ray, this._capsuleRadius * this._scale, this._capsuleHeight * this._scale, this._orientation, this._mask, this._maxDistance, this._queryTrigger)) {
                        const results = PhysicsSystem.instance.sweepCastResults;

                        for (let i = 0; i < results.length; i++) {
                            const result = results[i];
                            const hitPoint = this.getHitPoint();
                            if(hitPoint) {
                                hitPoint.setWorldPosition(result.hitPoint);
                                hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                            }
                        }
                    }
                    break;
            }
        }
    }

    // onStartPointX(customEventData:any) {
    //     const value = customEventData._progress * 2 - 1;
    //     this.StartPointDistance = value * 10;
    //     this.OnCurveCast();
    // }
    
    onStartPointY(customEventData:any) {
        const value = customEventData._progress;
        this.StartPointY = value * 5;
        this.OnCurveCast();
    }

    onStartPointZ(customEventData:any) {
        const value = customEventData._progress * 2 - 1;
        this.StartPointZ = value * 10;
        this.OnCurveCast();
    }

    onStartPointHeight(customEventData:any) {
        const value = customEventData._progress;
        this.StartPointHeight = value * 20;
        this.OnCurveCast();
    }

    onControlPointDistance(customEventData:any) {
        const value = customEventData._progress;
        this.ControlPointDistance = value * 18;
        this.OnCurveCast();
    }

    onControlPointHeight(customEventData:any) {
        const value = customEventData._progress;
        this.ControlPointHeight = value * 20;
        this.OnCurveCast();
    }
    
    onEndPointDistance(customEventData:any) {
        const value = customEventData._progress;
        this.EndPointDistance = value * 18;
        this.OnCurveCast();
    }

    onEndPointHeight(customEventData:any) {
        const value = customEventData._progress;
        this.EndPointHeight = value * 20;
        this.OnCurveCast();
    }

    onSetCurveCastClosest() {
        this.sweepType = ESweepType.CLOSEST;
        this.OnCurveCast();
    }

    onSetCurveCastAll() {
        this.sweepType = ESweepType.ALL;
        this.OnCurveCast();
    }

    onSetShapeBox() {
        this.generateSegments(this.SampleNumnber, ESweepShapeType.BOX);
    }
    
    onSetShapeSphere() {
        this.generateSegments(this.SampleNumnber, ESweepShapeType.SPHERE);
    }

    onSetShapeCapsule() {
        this.generateSegments(this.SampleNumnber, ESweepShapeType.CAPSULE);
    }

    onSetSampleNumber(editBox: EditBox) {
        const value = parseInt(editBox.string);
        return this.generateSegments(value, this.sweepShapeType);
    }

    onRotationX(customEventData:any) {
        const value = (customEventData._progress * 2 - 1) * 90;
        this._rotation.x = value;
        this.OnCurveCast();
    }

    onRotationY(customEventData:any) {
        const value = (customEventData._progress * 2 - 1) * 90;
        this._rotation.y = value;
        this.OnCurveCast();
    }

    onRotationZ(customEventData:any) {
        const value = (customEventData._progress * 2 - 1) * 90;
        this._rotation.z = value;
        this.OnCurveCast();
    }

    onSetScale(customEventData:any) {
        let value = customEventData._progress * 5;
        if(value<0.02) value = 0.02;
        this._scale = value;
        this.OnCurveCast();
    }

    onMaxDistance(customEventData:any) {
        const value = customEventData._progress * 30;
        this._maxDistance = value;
        this.OnCurveCast();
    }

    onClickQueryTrigger(toggle: Toggle) {
        this._queryTrigger = toggle.isChecked;
        this.OnCurveCast();
    }

    onChangeSweepMask(toggle: Toggle) {
        if(toggle.isChecked){
            //add mask
            this._mask |= 1 << 1;
        } else{
            //remove mask
            this._mask &= ~(1 << 1);
        }

        this.OnCurveCast();
    }

    generateSegments(sampleNumber : number, sweepShapeType: ESweepShapeType){
        if (isNaN(sampleNumber)) return;
        if (sampleNumber >= 2 ) {
            if(this.lineSegmentContainer.children.length ===0 || sampleNumber != this.SampleNumnber || sweepShapeType != this.sweepShapeType){
                //get shape
                this.sweepShapeType = sweepShapeType as ESweepShapeType;
                let sweepShape = null;
                switch (this.sweepShapeType) {
                    case ESweepShapeType.BOX:
                        sweepShape = this._sweepBox;
                        break;
                    case ESweepShapeType.SPHERE:
                        sweepShape = this._sweepSphere;
                        break;
                    case ESweepShapeType.CAPSULE:
                        sweepShape = this._sweepCapsule;
                        break;
                    default:
                        sweepShape = this._sweepBox;
                        break;
                }
                this.SampleNumnber = sampleNumber;
                this.lineSegmentContainer.removeAllChildren();
                for(let s = 0; s < this.SampleNumnber; s++){
                    const lineSegment = instantiate(sweepShape) as Node;        
                    this.lineSegmentContainer.addChild(lineSegment);
                }
                this.OnCurveCast();
            }
        }
    }
}
