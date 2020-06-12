import { _decorator, Component, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const _pos = new Vec3();
const _quat = new Quat();

@ccclass('JellyFish')
export class JellyFish extends Component {

    @property
    public speed = 0.01;

    @property
    public mixDuration = 1;

    @property
    public range = 50;

    public _dstPos = new Vec3();
    public _dstRot = new Quat();
    public _dir = new Vec3();
    public _changing = true;
    public _time = 0;

    public onLoad () {
        const x = Math.random() * this.range - this.range / 2;
        const y = Math.random() * this.range - this.range / 2;
        const z = Math.random() * this.range - this.range / 2;
        this.node.setPosition(x, y, z);
        this.newDst();
    }

    public newDst () {
        this._dstPos.x = Math.random() * this.range - this.range / 2;
        this._dstPos.y = Math.random() * this.range - this.range / 2;
        this._dstPos.z = Math.random() * this.range - this.range / 2;

        this.node.getPosition(_pos);
        const temp = new Vec3();
        temp.set(this._dstPos);
        this._dstPos.subtract(_pos);
        this._dir.set(this._dstPos);
        this._dstPos.set(temp);
        const angle = Math.atan2( this._dir.x, this._dir.z );
        this._dstRot.x = 0;
        this._dstRot.y = 1 * Math.sin( angle / 2 );
        this._dstRot.z = 0;
        this._dstRot.w = Math.cos( angle / 2 );
        Quat.normalize(this._dstRot, this._dstRot);

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

    public update (dt: number) {
        this._time += dt;
        if (this._changing) {
            if (this._time >= this.mixDuration) {
                this.node.setRotation(this._dstRot);
                this._changing = false;
            }
            else {
                const ratio = this._time / this.mixDuration;
                this.node.getRotation(_quat);
                _quat.lerp(this._dstRot, ratio);

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
