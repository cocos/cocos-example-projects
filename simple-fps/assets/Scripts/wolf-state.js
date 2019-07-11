@cc._decorator.ccclass()
export class WolfState extends cc.Component {
	constructor() {
		super();
		this._currentState = States.idle;
	}
	
	start () {
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            return;
        }
        const siteState = animationComponent.getState(this._getAnimationName(States.site));
        siteState.wrapMode = 'once';
    }
	
	update (dt) {
    }
    
    switchTo (state) {
        if (state === this._currentState) {
            return;
        }
        this._currentState = state;
        const animationComponent = this._getAnimationComponent();
        if (!animationComponent) {
            return;
        }
        const animationName = this._getAnimationName(state);
        animationComponent.play(animationName, 0.0);
    }

    _getAnimationName (state) {
        let animationName = null;
        switch (state) {
            case States.idle:
                animationName = '04_Idle';
                break;
            case States.walk:
                animationName = '02_walk';
                break;
            case States.run:
                animationName = '01_Run';
                break;
            case States.creep:
                animationName = '03_creep';
                break;
            case States.site:
                animationName = '05_site';
                break;
            case States.death:
                animationName = '03_creep';
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
    creep: 3,
    site: 4,
    death: 5,
};
