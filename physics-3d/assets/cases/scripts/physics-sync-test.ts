import { _decorator, Component, Node, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('physicsSyncTest')
export class physicsSyncTest extends Component {

    count = 0;

    onEnable () {
        PhysicsSystem.instance.enable = false;
    }
    
    onDisable () {
        PhysicsSystem.instance.enable = true;
    }

    update (dt: number) {
        if (this.count == 20) {
            this.node.setWorldPosition(0, 0.5, 0);
        } else if (this.count == 80) {
            PhysicsSystem.instance.enable = true;
        }

        this.count++;
    }
}
