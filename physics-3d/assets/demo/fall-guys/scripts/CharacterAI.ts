import { _decorator, Component, Node } from 'cc';
import { RigidCharacter } from './RigidCharacter';
const { ccclass, property, menu } = _decorator;

@ccclass('FALL-GUYS.CharacterAI')
@menu('demo/fall-guys/CharacterAI')
export class CharacterAI extends Component {

    rigidCharacter: RigidCharacter = null!;

    start () {
        this.rigidCharacter = this.getComponent(RigidCharacter)!;
    }

    update (deltaTime: number) {
        this.rigidCharacter.updateFunction(deltaTime);
    }
}
