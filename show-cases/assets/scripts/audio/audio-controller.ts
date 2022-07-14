import { _decorator, AudioSourceComponent, Component, LabelComponent, Toggle, AudioClip, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {

    @property(AudioSourceComponent)
    public source: AudioSourceComponent = null!;

    public volume?: Slider;
    public currentTime?: Slider;
    public volumeLabel?: LabelComponent;
    public currentTimeLabel?: LabelComponent;
    public loop?: Toggle;
    public playOnAwake?: Toggle;
    public playing?: Toggle;

    public start () {
        this.volume = this.node.getChildByName('volume')!.getComponent(Slider)!;
        this.currentTime = this.node.getChildByName('currentTime')!.getComponent(Slider)!;
        this.volumeLabel = this.volume.node.getChildByName('Numbers')!.getComponent(LabelComponent)!;
        this.currentTimeLabel = this.currentTime.node.getChildByName('Numbers')!.getComponent(LabelComponent)!;
        this.loop = this.node.getChildByName('loop')!.getComponent(Toggle)!;
        this.playOnAwake = this.node.getChildByName('playOnAwake')!.getComponent(Toggle)!;
        this.playing = this.node.getChildByName('playing')!.getComponent(Toggle)!;

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
    public setVolume (e: Slider) {
        this.source.volume = e.progress;
    }
    // slider callback
    public setCurrentTime (e: Slider) {
        this.source.currentTime = e.progress * this.source.duration;
    }

    // toggle callback
    public setLoop (e: Toggle) {
        this.source.loop = e.isChecked;
    }
    // toggle callback
    public setPlayOnAwake (e: Toggle) {
        this.source.playOnAwake = e.isChecked;
    }
}
