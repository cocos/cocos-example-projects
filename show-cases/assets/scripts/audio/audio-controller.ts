import { _decorator, AudioSourceComponent, Component, LabelComponent, SliderComponent, ToggleComponent, AudioClip, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {

    @property(AudioSourceComponent)
    public source: AudioSourceComponent = null!;

    public volume?: SliderComponent;
    public currentTime?: SliderComponent;
    public volumeLabel?: LabelComponent;
    public currentTimeLabel?: LabelComponent;
    public loop?: ToggleComponent;
    public playOnAwake?: ToggleComponent;
    public playing?: ToggleComponent;

    public start () {
        this.volume = this.node.getChildByName('volume')!.getComponent(SliderComponent)!;
        this.currentTime = this.node.getChildByName('currentTime')!.getComponent(SliderComponent)!;
        this.volumeLabel = this.volume.node.getChildByName('Numbers')!.getComponent(LabelComponent)!;
        this.currentTimeLabel = this.currentTime.node.getChildByName('Numbers')!.getComponent(LabelComponent)!;
        this.loop = this.node.getChildByName('loop')!.getComponent(ToggleComponent)!;
        this.playOnAwake = this.node.getChildByName('playOnAwake')!.getComponent(ToggleComponent)!;
        this.playing = this.node.getChildByName('playing')!.getComponent(ToggleComponent)!;

        this.node.getChildByName('name')!.getComponent(LabelComponent)!.string = this.source.node.name;

        let loadMode = 'Unknown Load Mode';
        if (!this.source.clip) {
            console.error('Need to specify AudioSource.clip');
            return;
        }
        switch (this.source.clip.loadMode) {
            case AudioClip.AudioType.WEB_AUDIO:
                loadMode = 'Web Audio API Mode';
                break;
            case AudioClip.AudioType.DOM_AUDIO:
                loadMode = 'DOM Audio Mode';
                break;
            case AudioClip.AudioType.NATIVE_AUDIO:
                loadMode = 'Native Audio Mode';
                break;
            case AudioClip.AudioType.MINIGAME_AUDIO:
                loadMode = 'MINIGAME Audio Mode';
                break;
            case AudioClip.AudioType.UNKNOWN_AUDIO:
                loadMode = 'UNKNOWN Audio Mode';
                break;
        }
        this.node.getChildByName('loadMode')!.getComponent(LabelComponent)!.string = loadMode;
    }

    public update () {
        this.volume!.progress = this.source.volume;
        this.currentTime!.progress = this.source.currentTime / this.source.duration;
        this.volumeLabel!.string = `${this.source.volume.toFixed(2)} / 1`;
        this.currentTimeLabel!.string = `${this.source.currentTime.toFixed(1)} / ${this.source.duration.toFixed(1)}`;

        this.loop!.isChecked = this.source.loop;
        this.playOnAwake!.isChecked = this.source.playOnAwake;
        this.playing!.isChecked = this.source.playing;
    }

    public play () {
        this.source.play();
    }

    public pause () {
        this.source.pause();
    }

    public stop () {
        this.source.stop();
    }

    // slider callback
    public setVolume (e: SliderComponent) {
        this.source.volume = e.progress;
    }
    // slider callback
    public setCurrentTime (e: SliderComponent) {
        this.source.currentTime = e.progress * this.source.duration;
    }

    // toggle callback
    public setLoop (e: ToggleComponent) {
        this.source.loop = e.isChecked;
    }
    // toggle callback
    public setPlayOnAwake (e: ToggleComponent) {
        this.source.playOnAwake = e.isChecked;
    }
}
