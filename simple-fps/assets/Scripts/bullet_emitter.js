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
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 子弹大小
        bulletScale :1,
        // 子弹速度
        bulletSpeed :80,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        const mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseDown: (...args) => this._mouseDownHandler(...args),
			onMouseUp: (...args) => this._mouseUpHandler(...args),
		});
        cc.eventManager.addListener(mouseListener, 1);
        this.score = 0;

    },

    update(dt) {
       
    },

    _playEffect(){
        const scene = this.node.scene;
        const character = scene.getChildByName('MainCharacter');
		const gun = character.getChildByName('SpaceSoldier_Male_01').getChildByName('RootNode').getChildByName('Gun');
        const effect = scene.getChildByName('guneffect');
        effect.setPosition(gun.getWorldPosition());

        const velocity = new cc.Vec3(0,0,1);
        const q = character.getWorldRotation();
        cc.vmath.vec3.transformQuat(velocity,velocity,q);
        cc.vmath.vec3.normalize(velocity, velocity);
        effect.direction = velocity;
        
        let coms = effect.getComponentsInChildren(cc.ParticleSystemComponent);
       // console.log(coms);
		coms.forEach(function(com){
			com.play();
		});
    },
    
    _mouseDownHandler(event) {
	},
    
 /*    _getModelPosition(modelnode){
        let model = modelnode.getComponent(cc.SkinningModelComponent);
        let position = new cc.Vec3();
        cc.vmath.vec3.copy(position,modelnode.getWorldPosition());
        let minpos = new cc.Vec3();
        cc.vmath.vec3.copy(minpos,model.mesh.minPosition);
        let maxpos = new cc.Vec3();
        cc.vmath.vec3.copy(maxpos,model.mesh.maxPosition);
        let mpos = new cc.Vec3();
     //   console.log(modelnode);
    //    cc.vmath.vec3.subtract(mpos,model.mesh.maxPosition,model.mesh.minPosition);
     //   cc.vmath.vec3.multiply(mpos,mpos,new cc.Vec3(0.5,0.5,0.5));
        console.log(minpos,maxpos);
        console.log(model.mesh.minPosition,model.mesh.maxPosition);
        let translation = modelnode.getWorldMatrix();
        cc.vmath.vec3.transformMat4(minpos, minpos, translation);
        cc.vmath.vec3.transformMat4(maxpos, maxpos, translation);

        console.log(minpos,maxpos);
        cc.vmath.vec3.subtract(mpos,maxpos,minpos);
        cc.vmath.vec3.multiply(mpos,mpos,new cc.Vec3(0.5,0.5,0.5));
        console.log(mpos);
       // cc.vmath.vec3.multiply(mpos,mpos,modelnode.getScale());
        cc.vmath.vec3.add(position, position, mpos);

       return position;
    }, */

	_mouseUpHandler(event) {
		if (event._button === 0) {
            console.log(`Clicked.`);
            // this._emitBall(this.node.getPosition(), this._getForward());

            const canvas = document.getElementById('GameCanvas');
            let ball = this._emitBallAt(event._x, event._y, canvas.clientWidth, canvas.clientHeight);
            this._playEffect();
		}
    },

    _emitBallAt(x, y, w, h) {
        const scene = this.node.scene;
        const character = scene.getChildByName('MainCharacter');
        const gun = character.getChildByName('SpaceSoldier_Male_01').getChildByName('RootNode').getChildByName('Gun');

     //   console.log('gun',gun);
     //   console.log(camera.name,cameraComponent.name);
        const from = gun.getWorldPosition();//gun.getWorldPosition();
      //  console.log(from);
        //const clickPosition = new cc.vmath.vec3();
       // cameraComponent.screenToWorld(new cc.vmath.vec3(x, y, 0), clickPosition);
       // console.log(x,y);
       // console.log(clickPosition);


        const velocity = new cc.Vec3(0,0,1);
        //cc.vmath.vec3.subtract(velocity, clickPosition, from);
        const q = character.getWorldRotation();
        cc.vmath.vec3.transformQuat(velocity,velocity,q);
        cc.vmath.vec3.normalize(velocity, velocity);

       return this._emitBall(from, velocity);
    },

    _emitBall(position, velocity) {
        const ball = cc.instantiate(this.bulletPrefab);
        ball.on('collided', (para) => {
            if(para.source.name === 'enemy' ) {
                
                this.score += 1;
      //          para.destroy();
             //   para.source.removeComponent(cc.BoxColliderComponent);
                para.target.getComponent(cc.BoxColliderComponent).enabled = false;
                console.log(`ball collided.`,para.source,para.target);
            }
            setTimeout(() => {
                ball.active = false;
            }, 1000);
        });
        ball.active = true;
        ball.setScale(this.bulletScale,this.bulletScale,this.bulletScale);
        this.node.parent.addChild(ball);
        
        ball.setPosition(position);

        //console.log(ball);
        const ballRigidBodyComponent = ball.getComponent(cc.RigidBodyComponent);
        //console.log(ballRigidBodyComponent);
        if (ballRigidBodyComponent) {
            // ballRigidBodyComponent.mass = 0;
          //  ballRigidBodyComponent.body.pullTransform();
             // ballRigidBodyComponent.mass = 0;
           //  ballRigidBodyComponent.syncPhysWithScene();

             const speed = this.bulletSpeed;
             cc.vmath.vec3.scale(velocity, velocity, speed);
             ballRigidBodyComponent.velocity = velocity;
             console.log('root',ballRigidBodyComponent.velocity);
        }
        return ball;
    },
});
