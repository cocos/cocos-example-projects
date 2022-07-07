// 导入Player脚本
import player from "./Player";

import { _decorator, Component, Node, SystemEventType, EventMouse, Vec3, CCFloat, Vec2, EventTouch,animation,AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {


    @property({displayName: "Player Script Node", tooltip: "Node where player script is applied.", type: player})
    player: player = null!;


    @property({
        displayName: "Camera movement event processing node", 
        tooltip: "Scripts binds camera movement event on this node，suggest to set the height and width the same with canvas with widgets.", 
        type: Node
    })
    target: Node = null!;

    @property({displayName: "Camera", tooltip: "Camera", type: Node})
    camera: Node = null!;


    @property({displayName: "Camera Move Speed.", tooltip: "Camera move speed.", type: CCFloat})
    angle_speed: number = 0.1;

    @property({displayName: "Jump Height", tooltip: "Jump height, the script calculates y direction speed based on this.", type: CCFloat})
    jump_height: number = 5;

    @property({displayName: "Jump Button Break Time", tooltip: "Break time in seconds before jump button can be pressed again.", type: CCFloat})
    jump_btn_time: number = 1;

    @property({displayName: "Attack Button Break Time", tooltip: "Break time in seconds before attack button can be pressed again.", type: CCFloat})
    attack_btn_time: number = 1;

    @property({displayName: "Camera Vertical Movement Limit ", tooltip: "Limit camera rotation on x axis, X is the limit upward, Y is the limit downward."})
    cam_att: Vec2 = new Vec2(-25, -50);

    @property({displayName: "Animation Controller Node", tooltip: "Node where animation graph is applied", type: animation.AnimationController})
    animCtrl: animation.AnimationController = null!;

    // 是否可以跳跃
    is_jump: boolean = true;
    is_attack: boolean = true;

    onLoad () {
        let self = this;

        // 给canvas绑定触摸移动事件
        this.target.on(SystemEventType.TOUCH_MOVE, function (e: EventTouch) {
            
            // 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性
            let D = e.getDelta();

            
            // 上下左右移动视角
            // 左右移动视角是移动角色的Y旋转
            if (D.x < 0) {
                self.player.node.eulerAngles = self.player.node.eulerAngles.add3f(0, -D.x * self.angle_speed , 0);
            } else if (D.x > 0) {
                self.player.node.eulerAngles = self.player.node.eulerAngles.add3f(0, -D.x * self.angle_speed, 0);
            }

            // 上下移动视角是移动相机的X旋转
            if (D.y < 0) {
                self.camera.eulerAngles = self.camera.eulerAngles.add3f(D.y * self.angle_speed, 0, 0);
            } else if (D.y > 0) {
                self.camera.eulerAngles = self.camera.eulerAngles.add3f(D.y * self.angle_speed, 0, 0);
            }


            // 限制相机上下移动范围
            let angle = self.camera.eulerAngles;
            if (self.camera.eulerAngles.x > self.cam_att.x) {
                self.camera.eulerAngles = new Vec3(self.cam_att.x, angle.y, angle.z);
            }
            if (self.camera.eulerAngles.x < self.cam_att.y) {
                self.camera.eulerAngles = new Vec3(self.cam_att.y, angle.y, angle.z);
            }

        }, this);
    }


    // 跳跃按钮专用函数
    onbtn_jump () {
        if (this.is_jump == true) {
            // 获取角色移动向量
            let vc = new Vec3(0, 0, 0);
            this.player.player.getLinearVelocity(vc);
            // 设置角色Y的移动向量，让角色跳起来
            this.player.player.setLinearVelocity(new Vec3(vc.x, this.jump_height, vc.z));

            this.animCtrl.setValue('Jump', true)

            let self = this;
            // 不可以再次跳跃
            this.is_jump = false;
            // 规定时间后恢复跳跃
            this.scheduleOnce(function () {
                self.is_jump = true;
            }, this.jump_btn_time);
        }
    }

    // 攻击按钮专用函数
    onbtn_attack () {
        if (this.is_attack == true) {

            console.log("点击了攻击按钮");

            this.animCtrl.setValue('Attack', true)

            let self = this;
            // 不可以再次跳跃
            this.is_attack = false;
            // 规定时间后恢复跳跃
            this.scheduleOnce(function () {
                self.is_attack = true;
            }, this.attack_btn_time);
        }
    }
    
}