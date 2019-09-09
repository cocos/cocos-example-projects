import { _decorator, Component, EffectAsset, ModelComponent, SphereColliderComponent, Color, Vec3, Node, Material } from "cc";
const { ccclass, property } = _decorator;

const hintMesh = cc.utils.createMesh(cc.primitives.capsule(1));
const sphereMesh = cc.utils.createMesh(cc.primitives.sphere(1));
const outOfBounds = (v, border = 20) => Math.abs(v.x) > border || Math.abs(v.y) > border || Math.abs(v.z) > border;
const pbrParams = cc.v4(0.8, 0.1, 1, 1);

const v3_1 = new Vec3();

class Element extends Component {
    velocity = new Vec3();
    color = new Color();
    collided = false;
    framesRemaining = 0;
    pass = null;
    hColor = 0;
}

// encapsulate an interesting emitter, emitted particles will
// annihilate after collision, if satisfying filter condition
@ccclass("Emitter")
export class Emitter extends Component {

    @property
    poolSize = 50;

    @property
    group = 0;

    @property
    mask = 0;

    @property
    leftAngle = 0;

    @property
    rightAngle = 0;

    @property
    color = new Color();

    @property(EffectAsset)
    effectAsset = null;

    _deadpool = [];
    _livepool = [];

    // generate everything procedurally
    start () {
      // emitter hint
      const hint = new Node();
      const hintModel = hint.addComponent(ModelComponent);
      const hintMat = new Material();
      hintMat.initialize({ effectName: 'builtin-standard' });
      hintMat.setProperty('albedo', this.color);
      hintMat.setProperty('pbrParams', pbrParams);
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
        mat.setProperty('pbrParams', pbrParams);
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
        col.on('onTriggerEnter', (e) => {
          const col = e.selfCollider;
          const ele = col.node.getComponent(Element);
          if (ele.collided) return;
          ele.color.a = 255;
          ele.pass.setUniform(ele.hColor, ele.color);
          ele.collided = true;
          ele.framesRemaining = 5;
          Vec3.set(ele.velocity, 0, 0, 0);
          col.setGroup(0); col.setMask(0);
        });
        // store
        node.active = false;
        this._deadpool.push(info);
      }
    }

    update () {
      for (let i = 0; i < this._livepool.length; i++) {
        let ele = this._livepool[i];
        if (ele.collided) {
          if (ele.framesRemaining-- <= 0) this.reap(ele);
        } else {
          Vec3.add(v3_1, ele.node.position, ele.velocity);
          ele.node.setPosition(v3_1);
          if (outOfBounds(v3_1)) this.reap(ele);
        }
      }
      if (this._deadpool.length > 0) this.resurrect();
      // for (let i = 0; i < this._deadpool.length; i++) this.resurrect();
    }

    reap (ele) {
      ele.node.active = false;
      this._livepool.splice(this._livepool.indexOf(ele), 1);
      this._deadpool.push(ele);
    }

    reapAll () {
      for (let i = 0; i < this._livepool.length; i++) {
        let ele = this._livepool[i];
        ele.node.active = false;
        this._deadpool.push(ele);
      }
      this._livepool.length = 0;
    }

    resurrect () {
      let ele = this._deadpool.pop();
      let theta = cc.math.toRadian(cc.math.randomRange(this.leftAngle, this.rightAngle));
      let phi = cc.math.randomRange(1, 2);
      let speed = cc.math.randomRange(0.1, 0.3);
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
