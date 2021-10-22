import { _decorator, Color, Component, EffectAsset, Material, ModelComponent, Node,
  SphereColliderComponent, Vec3, utils, primitives, Mesh, math, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

let hintMesh: Mesh;
let sphereMesh: Mesh;
const outOfBounds = (v: Vec3, border = 20) => Math.abs(v.x) > border || Math.abs(v.y) > border || Math.abs(v.z) > border;

const v3_1 = new Vec3();

class Element extends Component {
    public velocity = new Vec3();
    public color = new Color();
    public collided = false;
    public framesRemaining = 0;
    public pass = null;
    public hColor = 0;
}

// encapsulate an interesting emitter, emitted particles will
// annihilate after collision, if satisfying filter condition
@ccclass('Emitter')
export class Emitter extends Component {

    @property
    public poolSize = 50;

    @property
    public group = 0;

    @property
    public mask = 0;

    @property
    public leftAngle = 0;

    @property
    public rightAngle = 0;

    @property
    public color = new Color();

    @property(EffectAsset)
    public effectAsset = null;

    public _deadpool: Element[] = [];
    public _livepool: Element[] = [];

    // generate everything procedurally
    public start () {
      if (!hintMesh) {
        hintMesh = utils.createMesh(primitives.capsule(1));
        sphereMesh = utils.createMesh(primitives.sphere(1));
      }
      // emitter hint
      const hint = new Node();
      const hintModel = hint.addComponent(ModelComponent);
      const hintMat = new Material();
      hintMat.initialize({ effectName: 'builtin-standard' });
      const hintColor = this.color.clone();
      hintColor.a = 255;
      hintMat.setProperty('albedo', hintColor);
      hintMat.setProperty('metallic', 0.1);
      hintModel.material = hintMat;
      hintModel.mesh = hintMesh;
      hint.parent = this.node;
      // elements
      for (let i = 0; i < this.poolSize; i++) {
        const node = new Node();
        node.parent = this.node;
        // element info
        const info = node.addComponent(Element);
        info.color.set(this.color);
        // model
        const model = node.addComponent(ModelComponent);
        const mat = new Material();
        mat.initialize({
            effectName: 'builtin-standard',
            technique: 1, // transparent
        });
        mat.setProperty('metallic', 0.1);
        info.pass = mat.passes[0];
        info.hColor = info.pass.getHandle('albedo');
        info.pass.setUniform(info.hColor, info.color);
        model.material = mat;
        model.mesh = sphereMesh;
        // collider
        const col = node.addComponent(SphereColliderComponent);
        col.radius = 1;
        col.isTrigger = true;
        col.setGroup(this.group); col.setMask(this.mask);
        col.on('onTriggerEnter', (e: ITriggerEvent) => {
          const collider = e.selfCollider;
          const ele = collider.node.getComponent(Element);
          if (ele.collided) { return; }
          ele.color.a = 255;
          ele.pass.setUniform(ele.hColor, ele.color);
          ele.collided = true;
          ele.framesRemaining = 5;
          Vec3.set(ele.velocity, 0, 0, 0);
          collider.setGroup(0); collider.setMask(0);
        });
        // store
        node.active = false;
        this._deadpool.push(info);
      }
    }

    public update () {
      for (let i = 0; i < this._livepool.length; i++) {
        const ele = this._livepool[i];
        if (ele.collided) {
          if (ele.framesRemaining-- <= 0) { this.reap(ele); }
        } else {
          Vec3.add(v3_1, ele.node.position, ele.velocity);
          ele.node.setPosition(v3_1);
          if (outOfBounds(v3_1)) { this.reap(ele); }
        }
      }
      if (this._deadpool.length > 0) { this.resurrect(); }
      // for (let i = 0; i < this._deadpool.length; i++) this.resurrect();
    }

    public reap (ele: Element) {
      ele.node.active = false;
      this._livepool.splice(this._livepool.indexOf(ele), 1);
      this._deadpool.push(ele);
    }

    public reapAll () {
      for (let i = 0; i < this._livepool.length; i++) {
        const ele = this._livepool[i];
        ele.node.active = false;
        this._deadpool.push(ele);
      }
      this._livepool.length = 0;
    }

    public resurrect () {
      const ele = this._deadpool.pop();
      const theta = math.toRadian(math.randomRange(this.leftAngle, this.rightAngle));
      const phi = math.randomRange(1, 2);
      const speed = math.randomRange(0.1, 0.3);
      Vec3.set(ele.velocity, Math.cos(theta) * Math.sin(phi) * speed,
        Math.cos(phi) * speed, Math.sin(theta) * Math.sin(phi) * speed);
      ele.color.a = this.color.a; ele.collided = false;
      ele.pass.setUniform(ele.hColor, ele.color);
      const col = ele.node.getComponent(SphereColliderComponent);
      col.setGroup(this.group); col.setMask(this.mask);
      ele.node.setPosition(0, 0, 0);
      this._livepool.push(ele);
      ele.node.active = true;
    }
}
