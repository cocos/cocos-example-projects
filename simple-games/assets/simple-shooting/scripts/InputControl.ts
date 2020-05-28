import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent, EventTouch } from 'cc';
import { ShootingPlayerController } from './ShootingPlayerController';
import { ActionType } from './GameDefines';
const { ccclass, property } = _decorator;

@ccclass('InputControl')
export class InputControl extends Component {
    @property({type: [Node]})
    public actionButtons: Node[] = [];
    @property({type: ShootingPlayerController})
    public playerCtrl: ShootingPlayerController = null;

    onLoad() {

        this.actionButtons.forEach((button) => {
            button.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            button.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        })
    }

    onTouchStart(event: EventTouch) {
        const node = event.currentTarget as Node;
        if (node) {
            switch(node.name) {
                case 'Forward':  
                    this.playerCtrl.doAction(ActionType.Forward, true);
                    break;
                case 'Backward':  
                    this.playerCtrl.doAction(ActionType.Backward, true);
                    break;
                case 'Left':  
                    this.playerCtrl.doAction(ActionType.Left, true);
                    break;
                case 'Right':  
                    this.playerCtrl.doAction(ActionType.Right, true);
                    break;
                case 'Shoot':  
                    this.playerCtrl.doAction(ActionType.Shoot, true);
                    break;
                case 'ThrowGrenade':
                    this.playerCtrl.doAction(ActionType.ThrowGrenade, true);
                    break;
            }
        }
    }

    onTouchEnd(event) {
        const node = event.currentTarget as Node;
        if (node) {
            switch(node.name) {
                case 'Forward':  
                    this.playerCtrl.doAction(ActionType.Forward, false);
                    break;
                case 'Backward':  
                    this.playerCtrl.doAction(ActionType.Backward, false);
                    break;
                case 'Left':  
                    this.playerCtrl.doAction(ActionType.Left, false);
                    break;
                case 'Right':  
                    this.playerCtrl.doAction(ActionType.Right, false);
                    break;
            }
        }
    }
}