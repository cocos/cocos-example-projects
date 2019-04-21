// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        targetPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 目标的数量
        numberTarget :1,
        // 目标的散布半径
        targetAreaUniformExtent:50,
        //boxAreaHalfExtents : new Vec3(targetAreaUniformExtent, targetAreaUniformExtent, targetAreaUniformExtent),
        // 目标盒子的中心点
        targetAreaCenter :new cc.Vec3(0, 0, 0),
        // 目标的缩放值
        targetUniformScale :5
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        this.score = 0;
        this.boxAreaHalfExtents = new cc.Vec3(this.targetAreaUniformExtent, this.targetAreaUniformExtent, this.targetAreaUniformExtent);
        this.targets = [];
        for (let iBox = 0; iBox < this.numberTarget; ++iBox) {
            

            // 使用给定的模板在场景中生成一个目标靶盒子节点
            const boxNode = cc.instantiate(this.targetPrefab);
            boxNode.on('collided',(para) => {
                if(para.source.name === 'bullet'){
                    this.score += 1;
                }
            });
            this.targets.push(boxNode);
             // 将新增的节点添加到 Ground 节点下面
            this.node.addChild(boxNode);
            console.log(boxNode.parent.name);
            // 为Box设置一个随机位置
            let boxModelComponent = boxNode.getComponent(cc.ModelComponent);
            boxNode.setPosition(this.getNewBoxPosition());
            boxNode.setScale(this.targetUniformScale, this.targetUniformScale, this.targetUniformScale);
            boxNode.active = true;
            //this.placeOntoGround(boxNode, boxModelComponent.mesh);
        }
     },

     update(dt) {
        const scene = this.node.scene;
        const canvas = scene.getChildByName('Canvas');
        const score = canvas.getChildByName('Score');

        score.getComponent(cc.LabelComponent).string = 'Score:  ' + Math.ceil(this.score/16) + '/' + this.numberTarget;
     },

     isWin() {
        return (Math.ceil(this.score/4) >= this.numberTarget);
     },

     reStart() {
        // reset score UI
        this.score = 0;

        // restart main character
        const scene = this.node.scene;
        const character = scene.getChildByName('MainCharacter');
        character.setPosition(0,0,0);
        // restart enemy 
        console.log('restart');
        for (let iBox = 0; iBox < this.numberTarget; ++iBox) {
            const boxNode = this.targets[iBox];
            boxNode.active = true;
           // console.log(boxNode);
            boxNode.getComponent(cc.BoxColliderComponent).enabled = true;

            const enemy = boxNode.getChildByName('SpaceSoldier_Male_02');
           // enemy.getComponent(cc.AnimationComponent).enabled = true;
           // enemy.getComponent(cc.AnimationComponent)._resetTarget();
        //    enemy.getComponent(cc.AnimationComponent).playAutomatically = true;
            // 为Box设置一个随机位置
            console.log(enemy.getComponent(cc.AnimationComponent));
            //let boxModelComponent = boxNode.getComponent(cc.ModelComponent);
            boxNode.setPosition(this.getNewBoxPosition());
            boxNode.setScale(this.targetUniformScale, this.targetUniformScale, this.targetUniformScale);
        }
     },

    getNewBoxPosition(){
        const position = new cc.Vec3(
            Math.random() * 2 - 1,
            0,
            Math.random() * 2 - 1,
        );
        cc.vmath.vec3.multiply(position, position, this.boxAreaHalfExtents);
        cc.vmath.vec3.add(position, position, this.targetAreaCenter);
        return position;
    },

    placeOntoGround (node, mesh) {
        const position = node.getPosition();
        const translation = node.getScale();
        cc.vmath.vec3.multiply(translation, translation, mesh.minPosition);
        cc.vmath.vec3.subtract(position, position, translation);
        node.setPosition(position);
    },
});
