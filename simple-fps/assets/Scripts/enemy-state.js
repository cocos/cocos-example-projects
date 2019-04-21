@cc._decorator.ccclass()
export class EnemyState extends cc.Component {
	constructor() {
		super();
		this._currentState = States.idle;
	}
	
	start () {
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            return;
        }
        const dState = animationComponent.getAnimationState(this._getAnimationName(States.death));
        dState.wrapMode = 'once';
    }
	
	update (dt) {
    }
    
    switchTo (state) {
        if (state === this._currentState) {
       //     console.log(state,this._currentState);
            return;
        }
        this._currentState = state;
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            console.log('_getAnimationComponent is NULL');
            return;
        }
        const animationName = this._getAnimationName(state);
      //  console.log(animationName);
        animationComponent.play(animationName, 0.0);
      //  console.log(animationComponent);
    }

    _getAnimationName (state) {
        let animationName = null;
        switch (state) {
            case States.idle:
                animationName = 'SH|Idle.3';
                break;
            case States.walk:
                animationName = 'SH|WalkGun';
                break;
            case States.run:
                animationName = 'SH|Run';
                break;
            case States.shoot:
                animationName = 'SH|ShootTorsoArmsPistol';
                break;
            case States.death:
                animationName = 'SH|Death';

        }
        return animationName;
    }

    _getAnimationComponent () {
        const animationComponent = this.node.getComponent(cc.AnimationComponent);
        if (animationComponent) {
            return animationComponent;
        }
        if (this.node.children.length === 0) {
            return null;
        }
        return this.node.children[0].getComponent(cc.AnimationComponent);
    }
}

export const States = {
    idle: 0,
    walk: 1,
    run: 2,
    creep: 3,
    shoot: 4,
    death: 5,
};
