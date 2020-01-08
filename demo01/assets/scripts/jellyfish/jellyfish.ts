import { _decorator, Component, Vec3, Quat } from "cc";
const { ccclass, property } = _decorator;

const _pos = new cc.Vec3();
const _cross = new cc.Vec3();
const _quat = new cc.Quat();

@ccclass("JellyFish")
export class JellyFish extends Component {

    @property
    speed = 0.01;

    @property
    mixDuration = 1;

    @property
    range = 50;

    _dstPos = new Vec3();
    _dstRot = new Quat();
    _dir = new Vec3();
    _changing = true;
    _time = 0;

    onLoad() {
        let x = Math.random() * this.range - this.range/2;
        let y = Math.random() * this.range - this.range/2;
        let z = Math.random() * this.range - this.range/2;
        this.node.setPosition(x, y, z);
        this.newDst();
    }

    newDst () {
        this._dstPos.x = Math.random() * this.range - this.range/2;
        this._dstPos.y = Math.random() * this.range - this.range/2;
        this._dstPos.z = Math.random() * this.range - this.range/2;

        this.node.getPosition(_pos);
        let temp = new cc.Vec3();
        temp.set(this._dstPos);
        this._dstPos.subtract(_pos);
        this._dir.set(this._dstPos);
        this._dstPos.set(temp);
        let angle = Math.atan2( this._dir.x, this._dir.z );
        this._dstRot.x = 0;
        this._dstRot.y = 1 * Math.sin( angle/2 );
        this._dstRot.z = 0;
        this._dstRot.w = Math.cos( angle/2 );
        cc.Quat.normalize(this._dstRot, this._dstRot);

        // let angle = cc.Vec3.angle(_pos, this._dstPos);
        // this._dstRot.x = _pos.x * Math.sin(angle/2);
        // this._dstRot.y = _pos.y * Math.sin(angle/2);
        // this._dstRot.z = _pos.z * Math.sin(angle/2);
        // this._dstRot.w = Math.cos(angle/2);
        // cc.Quat.normalize(this._dstRot, this._dstRot);

        // this._dstPos.sub(_pos, this._dir);
        this._dir.normalize();
        this._dir.multiplyScalar(this.speed);

        this._changing = true;
        this._time = 0;
    }

    // start() {},

    update(dt) {
        this._time += dt;
        if (this._changing) {
            if (this._time >= this.mixDuration) {
                this.node.setRotation(this._dstRot);
                this._changing = false;
            }
            else {
                let ratio = this._time / this.mixDuration;
                this.node.getRotation(_quat);
                _quat.lerp(this._dstRot,ratio);

                this.node.setRotation(_quat);
            }
        }

        this.node.getPosition(_pos);
        _pos.add(this._dir);
        this.node.setPosition(_pos);

        _pos.subtract(this._dstPos);

        if (_pos.length() < 5) {
            this.newDst();
        }
    }
}
