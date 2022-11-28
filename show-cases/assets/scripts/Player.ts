
// 导入Joystick脚本
import joy from "./Joystick"

import { _decorator, Component, Node, CCLoader, CCFloat, Vec2, log, RigidBody, RigidBodyComponent, Vec3, math,animation, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export default class Player extends Component {


    @property({displayName: "Joy Stick Node", tooltip: "node where Joystick script locates", type: joy})
    joy: joy = null!;


    @property({displayName: "Character", tooltip: "Character", type: RigidBodyComponent})
    player: RigidBodyComponent = null!;

    @property({displayName: "Animation Controller", tooltip: "Node where animation controller locates", type: animation.AnimationController})
    animCtrl: animation.AnimationController = null!;

    @property({displayName: "Lock Character Movement", tooltip: "Lock Character Movement"})
    is_fbd_player: boolean = false;


    @property({displayName: "Character Movement Speed", tooltip: "Character Movement Speed，suggest to set between 1 to 10.", type: CCFloat})
    speed: number = 3;


    // 角色的移动向量
    vector: Vec2 = new Vec2(0, 0);


    update () {
        // console.log("vector", this.vector.toString());
        

        // 如果没有禁锢角色
        if (this.is_fbd_player == false) {
            // 获取角色目标移动向量
            this.vector = this.joy.vector;
            // 归一化
            let dir = this.vector.normalize();
            // 乘速度
            let x = dir.x * this.speed;
            let y = dir.y * this.speed;

            this.animCtrl.setValue('VelocityX', x)
            //console.log(`VelocityX now: ${x}`);

            this.animCtrl.setValue('VelocityY', y)
            //console.log(`VelocityY now: ${y}`);
            // 获取角色当前移动向量
            let vc = new Vec3(0, 0, 0);
            this.player.getLinearVelocity(vc);
            // 结合成角色最终移动向量，因为摇杆获取的是Y轴，而最终设置的线性速度应该是Z轴，所以最后一个参数是负的
            let vec = new Vec3(x, vc.y, -y);

            // 向量四元数乘法
            Vec3.transformQuat(vec, vec, this.player.node.getRotation());

            // 设置角色移动向量
            this.player.setLinearVelocity(vec);
        }


    }



}