import { _decorator, Component, Node, Prefab, math, ColliderComponent, instantiate, Quat, Vec3 } from "cc";
const { ccclass, property } = _decorator;
const _tmpVec3 = new math.Vec3;
    _tmpVec3.y=1;
const _v3_0 = new Vec3();
const _quat_0 = new Quat();    

@ccclass("Instantiate")
export class Instantiate extends Component {
    @property({ type: Prefab })
    public boxPrefab: Prefab = null;

    @property
    public boxAmount: number = 30;

    start () {
        for (let i = this.boxAmount; i--;) {
            const boxNode = instantiate(this.boxPrefab) as Node;
            boxNode.setParent(this.node as Node);
           // boxNode.parent.active=true;
            boxNode.active=true;
            let t = i / this.boxAmount * 3.1415926 * 2 + 0.5; 
            _tmpVec3.x = t * 1 * Math.cos(t * 7);
            _tmpVec3.z = t * 1 * Math.sin(t * 7);
            boxNode.setWorldPosition( _tmpVec3.x, _tmpVec3.y, _tmpVec3.z);
        }
        const boxNode1 = instantiate(this.boxPrefab) as Node;
        boxNode1.setParent(this.node as Node);
        boxNode1.setWorldPosition( -7, 2.5, -1);
        const boxNode2 = instantiate(this.boxPrefab) as Node;
        boxNode2.setParent(this.node as Node);
        boxNode2.setWorldPosition( 7, 2.5, -1);
    }
    update (deltaTime: number) {
        if(this.node.children.length>0){
           _v3_0.set(-1, 1, 0);
           _v3_0.normalize();
           Quat.rotateAround(_quat_0, this.node.children[0].rotation, _v3_0, Math.PI * 0.01);
           // this.node.setRotation(_quat_0);
           for(let i = 0; i < this.node.children.length; i++){
              //this.node.children[i].active = true;
                this.node.children[i].setRotation(_quat_0);
            }
        }
    }
    reset(){
        for(let i = 0; i < this.node.children.length; i++){
            this.node.children[i].active=true;
        }
        this.node.parent.children[1].setWorldPosition(0,3.154,0);
    }
        /*for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = true;
        }*/
}
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }



