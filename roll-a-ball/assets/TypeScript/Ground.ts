import { _decorator, Component, Node, BoxColliderComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Ground")
export class Ground extends Component {
    
    start(){

    this.getComponent(BoxColliderComponent);
    
    }
    
    

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
