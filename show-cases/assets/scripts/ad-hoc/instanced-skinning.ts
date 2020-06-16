import { _decorator, Component, instantiate, Node, Prefab, Scene, SkeletalAnimationComponent, SliderComponent, Texture2D, ToggleComponent } from 'cc';
import { UnlitQuadComponent } from '../unlit-quad';
const { ccclass, property } = _decorator;

@ccclass('InstancedSkinning')
export class InstancedSkinning extends Component {

    @property(Prefab)
    public baseline = null;

    @property(Prefab)
    public testgroup = null;

    @property([Texture2D])
    public labelImages: Texture2D[] = [];

    @property
    public maxGroupCount = 10;

    @property
    private _groupCount = 1;

    @property
    set groupCount (val) {
        this._groupCount = val;
        this._updateGroups();
    }
    get groupCount () {
        return this._groupCount;
    }

    private _baselineNode: Node | null = null;
    private _testNodes: Node[] = [];
    private _nameLabels: Node[] = [];

    public start () {
        this._baselineNode = this._initGroup('Baseline', this.baseline, 0);
        this._updateGroups();
    }

    public toggleBaselineGroup (e: ToggleComponent) {
        this._baselineNode.active = e.isChecked;
    }

    public toggleAnimNames (e: ToggleComponent) {
        for (let i = 0; i < this._nameLabels.length; i++) {
            this._nameLabels[i].active = e.isChecked;
        }
    }

    public setGroups (e: SliderComponent) {
        this.groupCount = Math.floor(e.progress * this.maxGroupCount);
    }

    private _updateGroups () {
        for (let i = 0; i < this._groupCount; i++) {
            if (this._testNodes[i]) { this._testNodes[i].active = true; }
            else { this._testNodes.push(this._initGroup('TestGroup', this.testgroup, 5 * (i + 1))); }
        }
        for (let i = this._groupCount; i < this._testNodes.length; i++) {
            this._testNodes[i].active = false;
        }
    }

    private _initGroup (name: string, prefab: Prefab, posZ: number) {
        const len = this.labelImages.length;
        const group = new Node(name);
        group.parent = this.node.scene;
        for (let i = 0; i < len; i++) {
            const posX = Math.floor(posZ / 100) * 30 + i * 3;
            const inst = instantiate(prefab) as Node; inst.setPosition(posX, 0, posZ % 100); inst.parent = group;
            const label = inst.getChildByName('Label').getComponent(UnlitQuadComponent);
            label.texture = this.labelImages[i]; this._nameLabels.push(label.node);
            const animComp = inst.getChildByName('Model').getComponent(SkeletalAnimationComponent);
            const clipName = inst.name = animComp.clips[i].name;
            animComp.play(clipName);
        }
        return group;
    }
}
