@cc._decorator.ccclass()
export class CharacterState extends cc.Component {
	constructor() {
		super();
		this._currentState = States.idle;
	}
	
	start () {
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            return;
        }
        const siteState = animationComponent.getAnimationState(this._getAnimationName(States.shoot));
        siteState.wrapMode = 'once';
    }
	
	update (dt) {
    }
    
    switchTo (state) {
        if (state === this._currentState) {
           // console.log('same state',this._currentState,state);
            return;
        }
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            return;
        }
        const animationName = this._getAnimationName(state);
        if(animationComponent.getAnimationState(animationName)._isPlaying){
            return;
        }
        this._currentState = state;
        animationComponent.play(animationName, 0.0);
    }

    _getAnimationName (state) {
        let animationName = null;
        switch (state) {
            case States.idle:
                animationName = 'Ar_Idle.3';
                break;
            case States.walk:
                animationName = 'Ar-WalkGun';
                break;
            case States.run:
                animationName = 'Ar_Run';
                break;
            case States.hit:
                animationName = 'Ar_HitGun';
                break;
            case States.death:
                animationName = 'Ar_Death';
                break;
            case States.shoot:
                animationName = 'Ar_ShootTorsoArmsPistol';
                break;

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
    hit: 3,
    death: 4,
    shoot: 5,
};
