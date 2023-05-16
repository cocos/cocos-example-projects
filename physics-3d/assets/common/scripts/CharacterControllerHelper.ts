import { _decorator, Component, Node, LabelComponent, CharacterController } from 'cc';
const { ccclass, property, menu } = _decorator;

import { CharacterControllerTest } from '../../cases/scripts/CharacterControllerTest';

@ccclass('COMMON.CharacterControllerHelper')
@menu('common/CharacterControllerHelper')
export class CharacterControllerHelper extends Component {

    private _BoxCCT : Node = null!;
    private _CapsuleCCT : Node = null!;
    private _slopeLimitComp : Component = null!;
    private _stepOffsetComp : Component = null!;
    private _contactOffsetComp : Component = null!;
    private _scaleComp : Component = null!;
    private _descComp : Component = null!;

    onLoad() {
    }

    start() {
        this._BoxCCT = this.node.scene.getChildByName('BoxCCT')!;
        this._CapsuleCCT = this.node.scene.getChildByName('CapsuleCCT')!;

        const slopeLimitNode = this.node.scene.getChildByName('Canvas')!.getChildByName('最大爬坡角度')!;
        this._slopeLimitComp = slopeLimitNode.getChildByName('最大爬坡角度数值')!.getComponent(LabelComponent)!;
        
        const stepOffsetNode = this.node.scene.getChildByName('Canvas')!.getChildByName('最大台阶高度')!;
        this._stepOffsetComp = stepOffsetNode.getChildByName('最大台阶高度数值')!.getComponent(LabelComponent)!;

        const contactOffsetNode = this.node.scene.getChildByName('Canvas')!.getChildByName('接触间隙')!;
        this._contactOffsetComp = contactOffsetNode.getChildByName('接触间隙数值')!.getComponent(LabelComponent)!;

        const scaleNode = this.node.scene.getChildByName('Canvas')!.getChildByName('节点缩放')!;
        this._scaleComp = scaleNode.getChildByName('节点缩放数值')!.getComponent(LabelComponent)!;

        const descNode = this.node.scene.getChildByName('Canvas')!.getChildByName('测试说明')!;
        this._descComp = descNode.getComponent(LabelComponent)!;

    }

    onDestroy () {
    }
    
    onUseCapsuleCharacterController() {
        this._CapsuleCCT.active = true;
        this._BoxCCT.active = false;
        this._CapsuleCCT!.getComponent(CharacterControllerTest)!.onResetPosition();
    }

    onUseBoxCharacterController() {
        this._CapsuleCCT.active = false;
        this._BoxCCT.active = true;
        this._BoxCCT!.getComponent(CharacterControllerTest)!.onResetPosition();
    }

    onResetCCTPosition() {
        this._CapsuleCCT!.getComponent(CharacterControllerTest)!.onResetPosition();
        this._BoxCCT!.getComponent(CharacterControllerTest)!.onResetPosition();
    }

    onCCTJump() {
        this._CapsuleCCT!.getComponent(CharacterControllerTest)!.jump();
        this._BoxCCT!.getComponent(CharacterControllerTest)!.jump();
    }

    onChangeCCTSlopeLimit(customEventData:any) {
        const angleInDegree = Math.floor(customEventData._progress * 90);
        this._CapsuleCCT!.getComponent(CharacterController)!.slopeLimit = angleInDegree;
        this._BoxCCT!.getComponent(CharacterController)!.slopeLimit = angleInDegree;
        (this._slopeLimitComp as LabelComponent).string = angleInDegree.toString();
    }

    onChangeCCTStepOffset(customEventData:any) {
        const value = customEventData._progress;
        this._CapsuleCCT!.getComponent(CharacterController)!.stepOffset = value;
        this._BoxCCT!.getComponent(CharacterController)!.stepOffset = value;
        (this._stepOffsetComp as LabelComponent).string = value.toFixed(2);
    }

    
    onChangeCCTContactOffset(customEventData:any) {
        const value = customEventData._progress * 0.2;
        this._CapsuleCCT!.getComponent(CharacterController)!.contactOffset = value;
        this._BoxCCT!.getComponent(CharacterController)!.contactOffset = value;
        (this._contactOffsetComp as LabelComponent).string = value.toFixed(2);
    }

    onChangeCCTNodeScale(customEventData:any) {
        let value = customEventData._progress * 3;
        //clamp value to [0.01, 5]
        if (value < 0.1) {
            value = 0.1;
        }
        (this._CapsuleCCT! as Node).setWorldScale(value, value, value);
        (this._BoxCCT! as Node).setWorldScale(value, value, value);
        (this._scaleComp as LabelComponent).string = value.toFixed(2);
    }

    onEnableTestDesc(customEventData:any) {
        this._descComp.enabled = !(this._descComp.enabled);
    }
}
