import { _decorator, Component, Prefab, instantiate, Node, Vec3, CCInteger} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShootingGameManager')
export class ShootingGameManager extends Component {
    @property({type: Prefab})
    public boxPrfb: Prefab = null;
    @property({type: CCInteger})
    public bottomBoxNum: number = 5;

    start () {
        // Your initialization goes here.
        this.generateBoxes();
    }

    generateBoxes() {
        const bottomBoxNum = this.bottomBoxNum;
        const boxSize = 1;
        for (let i = 0; i < bottomBoxNum; i++) {   
            for (let j = 0; j < (bottomBoxNum - i); j++) {
                const boxNode:Node = instantiate(this.boxPrfb);
                const posX = i * boxSize / 2 + j;
                const posY = i + 0.1;
                boxNode.parent = this.node;
                boxNode.setWorldPosition(new Vec3(posX, posY, -10));
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
