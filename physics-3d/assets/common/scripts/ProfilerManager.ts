import { _decorator, Component, Node, profiler } from 'cc';
const { ccclass, property, menu } = _decorator;

let state = false;

@ccclass('COMMON.ProfilerManager')
@menu('common/ProfilerManager')
export class ProfilerManager extends Component {

    @property
    show = true;

    onLoad () {
        if (profiler) {
            state = profiler.isShowingStats();
            if (!state && this.show) profiler.showStats();
        }
    }

    onDestroy () {
        if (profiler) {
            state ? profiler.showStats() : profiler.hideStats();
        }
    }
}
