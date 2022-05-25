
import { _decorator, Component, Node, Toggle, director, log, setDisplayStats } from 'cc';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('OcclusionQuery')
export class OcclusionQuery extends Component {
    @property(Toggle)
    toggleOcclusionQuery: Toggle = null!;

    start () {
        setDisplayStats(true);

        if (NATIVE) {
            this.toggleOcclusionQuery.isChecked = director.root.pipeline.getOcclusionQueryEnabled();    
        } else {
            this.toggleOcclusionQuery.isChecked = false;
        }
        this.toggleOcclusionQuery.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        log('Occlusion query enabled: ' + this.toggleOcclusionQuery.isChecked);
    }

    onToggle (toggle: Toggle) {
        if (NATIVE) {
            director.root.pipeline.setOcclusionQueryEnabled(toggle.isChecked);
        }
        log('Occlusion query enabled: ' + toggle.isChecked);
    }
}
