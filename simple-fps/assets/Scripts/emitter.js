const { Component, ColliderComponentBase, RigidBodyComponent, Vec3, Node, ModelComponent, BoxColliderComponent } = cc;
const { box, wireframed } = cc.primitives;
const { createMesh } = cc.utils;
const { ccclass } = cc._decorator;

@ccclass('demo.emitter')
class BallEmitter extends Component {
    constructor () {
        super();
    }

    start () {
        const mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseDown: (...args) => this._mouseDownHandler(...args),
			onMouseUp: (...args) => this._mouseUpHandler(...args),
		});
        cc.eventManager.addListener(mouseListener, 1);
        
        const boxMesh = createMesh(box());
        const nBox = 7;
        const boxAreaUniformExtent = 50;
        const boxAreaHalfExtents = new Vec3(boxAreaUniformExtent, boxAreaUniformExtent, boxAreaUniformExtent);
        const boxAreaCenter = new Vec3(0, 0, 0);
        const boxUniformScale = 5;
        for (let iBox = 0; iBox < nBox; ++iBox) {
            const position = new Vec3(
                Math.random() * 2 - 1,
                0,
                Math.random() * 2 - 1,
            );
            cc.vmath.vec3.multiply(position, position, boxAreaHalfExtents);
            cc.vmath.vec3.add(position, position, boxAreaCenter);

            // Create node
            const boxNode = new Node();
            this.node.scene.addChild(boxNode);

            // Setup apperance
            const boxModelComponent = boxNode.addComponent(ModelComponent);
            boxModelComponent.mesh = boxMesh;
            let boxMaterial = null;
            const color = new cc.Color(255, 255, 255, 255);
            const updateColor = () => {
                if (!boxMaterial) {
                    return;
                }
                if(color.r === 0){
                 //   boxNode.removeComponent(boxRigidBodyComponent);
                 //   boxNode.removeComponent(boxColliderComponent);
                    boxNode.active = false;
                    return;
                }
                boxMaterial.setProperty('diffuseColor', color);
            };
            cc.loader.loadRes('resources/Materials/BoxStone', cc.Material, (err, asset) => {
                boxModelComponent.material = asset;
                boxMaterial = boxModelComponent.material;
                updateColor();
            });
            // boxModelComponent.enabled = false;

            // Setup transform
            boxNode.setPosition(position);
            boxNode.setScale(boxUniformScale, boxUniformScale, boxUniformScale);
            placeOntoGround(boxNode, boxModelComponent.mesh);

            // Setup collider
            const boxColliderComponent = boxNode.addComponent(BoxColliderComponent);
            setupBoxCollider(boxColliderComponent, boxModelComponent.mesh);

            // Setup rigidbody
            const boxRigidBodyComponent = boxNode.addComponent(RigidBodyComponent);

            boxNode.on('collided', () => {
                console.log(`box collided.`);
                const d = 90;
                color.r = cc.vmath.clamp(color.r - d, 0, 255);
                color.g = cc.vmath.clamp(color.g - d, 0, 255);
                color.b = cc.vmath.clamp(color.b - d, 0, 255);
                updateColor();
            });
        }
    }

    _mouseDownHandler(event) {
	}
	
	_mouseUpHandler(event) {
		if (event._button === 0) {
            console.log(`Clicked.`);
            // this._emitBall(this.node.getPosition(), this._getForward());

            const canvas = document.getElementById('GameCanvas');
            this._emitBallAt(event._x, event._y, canvas.clientWidth, canvas.clientHeight);
		}
    }

    _emitBallAt(x, y, w, h) {
        const scene = this.node.scene;
        const camera = scene.getChildByName('Camera');
        const cameraComponent = camera.getComponent('cc.CameraComponent');

        const from = camera.getPosition();
        const clickPosition = new cc.vmath.vec3();
        cameraComponent.screenToWorld(new cc.vmath.vec3(x, y, 0), clickPosition);

        const velocity = new cc.Vec3();
        cc.vmath.vec3.subtract(velocity, clickPosition, from);
        cc.vmath.vec3.normalize(velocity, velocity);

        this._emitBall(clickPosition, velocity);
    }

    _emitBall(position, velocity) {
        const ballTemplate = this._getBallTemplate();
        if (ballTemplate) {
            const ball = cloneNode(ballTemplate);
            ball.on('collided', () => {
                console.log(`ball collided.`);
                setTimeout(() => {
                    ball.active = false;
                }, 1000);
            });
            this.node.parent.addChild(ball);
            ball.setPosition(position);

            const ballRigidBodyComponent = ball.getComponent(RigidBodyComponent);
            if (ballRigidBodyComponent) {
                // ballRigidBodyComponent.mass = 0;
                ballRigidBodyComponent.body.pullTransform();

                const speed = 100;
                cc.vmath.vec3.scale(velocity, velocity, speed);
                ballRigidBodyComponent.body.velocity = velocity;
            }
        }
    }
    
    _getBallTemplate () {
        return this.node.parent.getChildByName('Ball');
    }

    _getForward() {
		return this._getDirection(0, 0, -1);
	}
	
	_getRight() {
		return this._getDirection(1, 0, 0);
	}
	
	_getUp() {
		return this._getDirection(0, 1, 0);
	}
	
	_getDirection(x, y, z) {
		const result = cc.v3(x, y, z);
		cc.vmath.vec3.transformQuat(result, result, this.node.getRotation());
		return result;
	}

    update (deltaTime) {
    }
}

function cloneNode (node) {
    return cc.instantiate(node);
}

function maxComponent(v) {
    return Math.max(v.x, Math.max(v.y, v.z));
}

function setupBoxCollider(boxCollider, mesh) {
    boxCollider.size = getBoundingBoxExtents(mesh);
    boxCollider.center = getBoundingBoxCenter(mesh);
}

function placeOntoGround (node, mesh) {
    const position = node.getPosition();
    const translation = node.getScale();
    cc.vmath.vec3.multiply(translation, translation, mesh.minPosition);
    cc.vmath.vec3.subtract(position, position, translation);
    node.setPosition(position);
}

function setupSphereCollider(sphereCollider, mesh) {

}

function getBoundingBoxExtents(mesh) {
    const size = new cc.Vec3();
    cc.vmath.vec3.subtract(size, mesh.maxPosition, mesh.minPosition);
    return size;
}

function getBoundingBoxCenter(mesh) {
    const extents = getBoundingBoxExtents(mesh);
    const center = new cc.Vec3();
    cc.vmath.vec3.scaleAndAdd(center, mesh.minPosition, extents, 0.5);
    return center;
}
