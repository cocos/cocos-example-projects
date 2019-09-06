import { _decorator, Component, Node } from "cc";
const { ccclass } = _decorator;
import { Con } from './Constants';
@ccclass("ButtonCol")
export class ButtonCol extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    //按钮组件
    private ForwardButton:Node=null;
    private RightButton:Node=null;
    private LeftButton:Node=null;
    private BackwardButton:Node=null;
    private JumpButton:Node=null;
    private ShootButton:Node=null;
    onLoad(){
        //按钮组件获取
        const canvas = cc.director.getScene().getChildByName('Canvas');
        this.RightButton =canvas.getChildByName('Right');
        this.ForwardButton =canvas.getChildByName('Forward');
        this.LeftButton =canvas.getChildByName('Left');
        this.BackwardButton =canvas.getChildByName('Backward');
        this.JumpButton =canvas.getChildByName('Jump');
        this.ShootButton =canvas.getChildByName('Shoot');
        //按钮监听
        this.ForwardButton.on(Node.EventType.TOUCH_END,this.ForwardButtonUp,this);
        this.ForwardButton.on(Node.EventType.TOUCH_START,this.ForwardButtonDown,this);
        this.RightButton.on(Node.EventType.TOUCH_END,this.RightButtonUp,this);
        this.RightButton.on(Node.EventType.TOUCH_START,this.RightButtonDown,this);
        this.LeftButton.on(Node.EventType.TOUCH_END,this.LeftButtonUp,this);
        this.LeftButton.on(Node.EventType.TOUCH_START,this.LeftButtonDown,this);
        this.BackwardButton.on(Node.EventType.TOUCH_END,this.BackwardButtonUp,this);
        this.BackwardButton.on(Node.EventType.TOUCH_START,this.BackwardButtonDown,this);
        this.JumpButton.on(Node.EventType.TOUCH_END,this.JumpButtonUp,this);
        this.JumpButton.on(Node.EventType.TOUCH_START,this.JumpButtonDown,this);
        this.ShootButton.on(Node.EventType.TOUCH_END,this.ShootButtonUp,this);
        this.ShootButton.on(Node.EventType.TOUCH_START,this.ShootButtonDown,this);
    }
        
    
    ForwardButtonDown(){
        Con.startForward = true;
        Con.buttonevent=true;
    }
    ForwardButtonUp(){
        Con.startForward = false;
        Con.buttonevent=false;
    }
    RightButtonDown(){
        Con.startRight = true;
        Con.buttonevent=true;
    }
    RightButtonUp(){
        Con.startRight = false;
        Con.buttonevent=false;
    }
    LeftButtonDown(){
        Con.startLeft = true;
        Con.buttonevent=true;
    }
    LeftButtonUp(){
        Con.startLeft = false;
        Con.buttonevent=false;
    }
    BackwardButtonDown(){
        Con.startBackward = true;
        Con.buttonevent=true;
    }
    BackwardButtonUp(){
        Con.startBackward = false;
        Con.buttonevent=false;
    }
    JumpButtonDown(){
        Con.startJump = true;
        Con.buttonevent=true;
    }
    JumpButtonUp(){
        Con.startJump = false;
        Con.buttonevent=false;
    }
    ShootButtonDown(){
        if (Con.PlayerHp>0) {
            Con.AniShoot=true;
        }
        Con.startShoot = true;
        Con.buttonevent=true;
    }
    ShootButtonUp(){
        Con.startShoot = false;
        Con.AniShoot=false;

        Con.isanirun=false;
        Con.isanijump=false;
        Con.isanishoot=false;
        Con.isaniidleshoot=false;
        Con.isanirunshoot=false;
        Con.isanijumpshoot=false;
        Con.buttonevent=false;
    }
}
