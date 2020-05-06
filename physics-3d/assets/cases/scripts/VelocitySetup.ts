import { _decorator, Component, Node, Vec3, RigidBodyComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VelocitySetup')
export class VelocitySetup extends Component {

    @property
    lv = new Vec3();

    start () {
        this.node.getComponent(RigidBodyComponent).setLinearVelocity(this.lv);
    }
}
