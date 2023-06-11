import { _decorator, Component, Node, CameraComponent, PhysicsSystem, Enum, Vec3, Primitive, 
    MeshRenderer, instantiate, Material, Color, Quat, director, EditBox, Label, LabelComponent, physics } from 'cc';
const { ccclass, property, menu } = _decorator;

enum ECurvecastType {
    ALL,
    CLOSEST,
}
Enum(ECurvecastType);

@ccclass('COMMON.CurvecastHelper')
@menu('common/CurvecastHelper')
export class CurvecastHelper extends Component {

    @property({ type: CameraComponent })
    cameraCom: CameraComponent = null!;

    private controlPointContainer = new Node("controlPointContainer");
    private hitPointContainer = new Node("hitPointContainer");
    private lineSegmentContainer = new Node("lineSegmentContainer");
    private _lineSegment: Node  = new Node('lineSegment');
    private _hitPoint: Node  = new Node('hitPoint');
    private _controlPoint: Node  = new Node('controlPoint');

    private CP0: Vec3 = new Vec3(1,0,12);//control point 0
    private CP1: Vec3 = new Vec3(1,10,4);//control point 1
    private CP2: Vec3 = new Vec3(1,0,0);//control point 2

    public CurveOrigin: Vec3 = new Vec3(-9,0,0);
    public StartPointDistance: number = 0;
    public StartPointHeight: number = 0;
    public ControlPointDistance: number = 9;
    public ControlPointHeight: number = 2;
    public EndPointDistance: number = 18;
    public EndPointHeight: number = 0;
    public SampleNumnber: number = 50;

    private curvecastType: ECurvecastType = ECurvecastType.ALL; 
    private hitSphereScale: number = 0.2;
    private controlPointScale: number = 0.2;

    private ResultLabel: any;

    __preload () {
        this.ResultLabel = this.node.scene.getChildByName('Canvas')!.getChildByName('Result')!.getComponent(LabelComponent)!;

        //init control point node
        const controlPointMaterial = new Material();
        controlPointMaterial.initialize({
            'effectName': 'builtin-standard'
        })
        controlPointMaterial.setProperty('mainColor', new Color(0, 255, 0, 255));
        let controlPointMesh = new Primitive(Primitive.PrimitiveType.BOX);//SPHERE is not working
        controlPointMesh.onLoaded();
        const _controlPointRenderCom = this._controlPoint.addComponent(MeshRenderer);
        _controlPointRenderCom.mesh = controlPointMesh;
        _controlPointRenderCom.material = controlPointMaterial;
        director.addPersistRootNode(this.controlPointContainer);

        //init hit point node
        const hitPointMaterial = new Material();
        hitPointMaterial.initialize({
            'effectName': 'builtin-standard'
        })
        hitPointMaterial.setProperty('mainColor', new Color(255, 255, 0, 255));
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

        this.SetSampleNumber(this.SampleNumnber);

        let expectationLabel = this.node.scene.getChildByName('Canvas')!.getChildByName('Expectation')!.getComponent(LabelComponent)!;
        expectationLabel.string = "physx和bullet跟所有类型碰撞体都可以有碰撞点\n builtin跟圆柱/圆锥体没有碰撞点\n cannon.js跟胶囊体没有碰撞点";
        //expectationLabel.string = "In physx and bullet, curve intersects with all kinds of colliders.\nIn builtin, curve doesn't intersect with cylinder and cone.\nIn cannon.js, curve doesn't intersect with capsule.";
    }

    onLoad() {
    }

    start(){
        this.OnCurveCast ();
    }

    onDestroy () {
        this.controlPointContainer.removeAllChildren();
        this.hitPointContainer.removeAllChildren();
        this.lineSegmentContainer.removeAllChildren();
    }

    sampleQuadraticBezierPoint(p0:Vec3, p1:Vec3, p2:Vec3, t: number):Vec3 {
        let u = 1 - t;   // (1 - t)
        let uu = u * u;   // (1 - t)²
        let tt = t * t;   // t²

        // (1 - t)²P₀ + 2(1 - t)tP₁ + t²P₂ where 0 ≤ t ≤ 1
        // u²P₀ + 2utP₁ + t²P₂
        //return (uu * p0) + (2 * u * t * p1) + (tt * p2);
        let ret = new Vec3(0);
        Vec3.multiplyScalar(ret, p0, uu);
        let ret1 = new Vec3(0);
        Vec3.multiplyScalar(ret1, p1, 2 * u * t);
        let ret2 = new Vec3(0);
        Vec3.multiplyScalar(ret2, p2, tt);
        Vec3.add(ret, ret, ret1);
        Vec3.add(ret, ret, ret2);
        return ret;
    }
    
    //assume plane is at (0,0,0) with normal(0,1,0)
    updateCurveControlPoints(p0:Vec3, p1:Vec3,p2:Vec3) {
        let forward = new Vec3(1,0,0);
        var up = new Vec3(0,1,0);

        p0.set(this.CurveOrigin);
        Vec3.scaleAndAdd(p0, this.CurveOrigin, forward, this.StartPointDistance);
        Vec3.scaleAndAdd(p0, p0, up, this.StartPointHeight);

        //p1 = p0 + forward * this.ControlPointDistance + up * this.ControlPointHeight;
        p1.set(0,0,0);
        Vec3.scaleAndAdd(p1, this.CurveOrigin, forward, this.ControlPointDistance);
        Vec3.scaleAndAdd(p1, p1, up, this.ControlPointHeight);

        //p2 = p0 + forward * this.EndPointDistance + up * this.EndPointHeight;
        p2.set(0,0,0);
        Vec3.scaleAndAdd(p2, this.CurveOrigin, forward, this.EndPointDistance);
        Vec3.scaleAndAdd(p2, p2, up, this.EndPointHeight);
    }

    OnCurveCast () {
        this.ResultLabel.string = "";

        //remnove all existing controlPoint, hitPoint and lineSegment node
        this.controlPointContainer.removeAllChildren();
        this.hitPointContainer.removeAllChildren();
        
        this.updateCurveControlPoints(this.CP0, this.CP1, this.CP2);

        const controlPoint0 = instantiate(this._controlPoint) as Node;
        controlPoint0.setScale(this.controlPointScale, this.controlPointScale, this.controlPointScale);
        controlPoint0.setWorldPosition(this.CP0);
        this.controlPointContainer.addChild(controlPoint0);

        const controlPoint1 = instantiate(this._controlPoint) as Node;
        controlPoint1.setScale(this.controlPointScale, this.controlPointScale, this.controlPointScale);
        controlPoint1.setWorldPosition(this.CP1);
        this.controlPointContainer.addChild(controlPoint1);
        
        const controlPoint2 = instantiate(this._controlPoint) as Node;
        controlPoint2.setWorldPosition(this.CP2);
        controlPoint2.setScale(this.controlPointScale, this.controlPointScale, this.controlPointScale);
        this.controlPointContainer.addChild(controlPoint2);

        let sampleArray = [];
        for(let s = 0; s < this.SampleNumnber; s++){
            let samplePos = this.sampleQuadraticBezierPoint(this.CP0, this.CP1, this.CP2, s/(this.SampleNumnber-1));
            sampleArray.push(samplePos);
        }

        let sampleDir = new Vec3();
        for(let s = 0; s < this.SampleNumnber - 1; s++){
            const lineSegment = this.lineSegmentContainer.children[s];
            let samplePos = sampleArray[s];
            
            Vec3.subtract(sampleDir, sampleArray[s+1], sampleArray[s]);
            let length = Vec3.len(sampleDir);
            Vec3.multiplyScalar(sampleDir, sampleDir, 1.0/length);
            let rotation = new Quat();
            Quat.rotationTo(rotation, new Vec3(0,1,0), sampleDir);
            
            lineSegment.setWorldPosition(samplePos);
            let scale = new Vec3(0.05, length, 0.05);
            lineSegment.setWorldScale(scale);
            lineSegment.setWorldRotation(rotation);

        }
        
        if (this.curvecastType == ECurvecastType.CLOSEST) {
            if (PhysicsSystem.instance.lineStripCastClosest(sampleArray)) {
                const result = PhysicsSystem.instance.lineStripCastClosestResult;
                const hitPoint = instantiate(this._hitPoint) as Node;
                hitPoint.setWorldPosition(result.hitPoint);
                hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                this.hitPointContainer.addChild(hitPoint);
                this.ResultLabel.string = this.ResultLabel.string.concat("hit line id: ").concat(result.id.toString());
            }
        } else if (this.curvecastType == ECurvecastType.ALL) {
            if (PhysicsSystem.instance.lineStripCast(sampleArray)) {
                this.ResultLabel.string = this.ResultLabel.string.concat("hit line id: ");
                const results = PhysicsSystem.instance.lineStripCastResults;
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    const hitPoint = instantiate(this._hitPoint) as Node;
                    hitPoint.setWorldPosition(result.hitPoint);
                    hitPoint.setScale(this.hitSphereScale, this.hitSphereScale, this.hitSphereScale);
                    this.hitPointContainer.addChild(hitPoint);
                    this.ResultLabel.string = this.ResultLabel.string.concat(result.id.toString().concat("--"));
                }
            }
        }
    }

    onStartPointDistance(customEventData:any) {
        const value = customEventData._progress;
        this.StartPointDistance = value * 18;
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
        this.curvecastType = ECurvecastType.CLOSEST;
        this.OnCurveCast();
    }

    onSetCurveCastAll() {
        this.curvecastType = ECurvecastType.ALL;
        this.OnCurveCast();
    }

    onSetSampleNumber(editBox: EditBox) {
        const value = parseInt(editBox.string);
        return this.SetSampleNumber(value);
    }

    SetSampleNumber(value : number){
        if (isNaN(value)) return;
        if (value >= 2 ) {
            if(value != this.lineSegmentContainer.children.length){
                this.SampleNumnber = value;
                this.lineSegmentContainer.removeAllChildren();
                for(let s = 0; s < this.SampleNumnber - 1; s++){
                    const lineSegment = instantiate(this._lineSegment) as Node;        
                    this.lineSegmentContainer.addChild(lineSegment);
                }
                this.OnCurveCast();
            }
        }
    }
}
