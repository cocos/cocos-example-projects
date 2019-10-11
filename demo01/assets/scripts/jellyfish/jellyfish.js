// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let _pos = new cc.Vec3();
let _cross = new cc.Vec3();
let _quat = new cc.Quat();


let JellyFish = cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.01,
        mixDuration: 1,
        range: 50
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let x = Math.random() * this.range - this.range/2;
        let y = Math.random() * this.range - this.range/2;
        let z = Math.random() * this.range - this.range/2;
        this.node.setPosition(x, y, z);

        this.dstPos = new cc.Vec3();
        this.dstRot = new cc.Quat();
        this.dir = new cc.Vec3();
        this.newDst();
    },

    newDst () {
        this.dstPos.x = Math.random() * this.range - this.range/2;
        this.dstPos.y = Math.random() * this.range - this.range/2;
        this.dstPos.z = Math.random() * this.range - this.range/2;

        this.node.getPosition(_pos);
        let temp = new cc.Vec3();
        temp.set(this.dstPos);
        this.dstPos.subtract(_pos);
        this.dir.set(this.dstPos);
        this.dstPos.set(temp);
        let angle = Math.atan2( this.dir.x, this.dir.z );
        this.dstRot.x = 0;
        this.dstRot.y = 1 * Math.sin( angle/2 );
        this.dstRot.z = 0;
        this.dstRot.w = Math.cos( angle/2 );
        cc.Quat.normalize(this.dstRot, this.dstRot);

        // let angle = cc.Vec3.angle(_pos, this.dstPos);
        // this.dstRot.x = _pos.x * Math.sin(angle/2);
        // this.dstRot.y = _pos.y * Math.sin(angle/2);
        // this.dstRot.z = _pos.z * Math.sin(angle/2);
        // this.dstRot.w = Math.cos(angle/2);
        // cc.Quat.normalize(this.dstRot, this.dstRot);

        // this.dstPos.sub(_pos, this.dir);
        this.dir.normalize();
        this.dir.multiplyScalar(this.speed);

        this._changing = true;
        this._time = 0;
    },

    // start() {},

    update(dt) {
        this._time += dt;
        if (this._changing) {
            if (this._time >= this.mixDuration) {
                this.node.setRotation(this.dstRot);
                this._changing = false;
            }
            else {
                let ratio = this._time / this.mixDuration;
                this.node.getRotation(_quat);
                _quat.lerp(this.dstRot,ratio);

                this.node.setRotation(_quat);
            }
        }

        this.node.getPosition(_pos);
        _pos.add(this.dir);
        this.node.setPosition(_pos);

        _pos.subtract(this.dstPos);

        if (_pos.length() < 5) {
            this.newDst();
        }
    },
});

export default JellyFish;
