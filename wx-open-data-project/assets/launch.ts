import { _decorator, Component, Node, LabelComponent, SpriteComponent, Vec3, SpriteFrame, ImageAsset, tweenUtil, Tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Launch")
export class Launch extends Component {
    @property(Node)
    wxSubContextView: Node = null;
    @property(LabelComponent)
    tips: LabelComponent = null;
    @property(SpriteComponent)
    avatar: SpriteComponent = null;
    @property(Node)
    bg: Node = null;
    @property(LabelComponent)
    nickName: LabelComponent = null;

    _isShow = false;
    _showAction: Tween;
    _hideAction: Tween;
    _pos = new Vec3();

    start() {
        // this.loadReadme();
        this.initAction();
        this.initUserInfoButton();
    }

    initAction() {
        this._isShow = false;
        const pos = this._pos = new Vec3(this.wxSubContextView.position);
        pos.y = 1000;
        const showPos = new Vec3(this.wxSubContextView.position);
        showPos.y = 0;
        const hidePos = new Vec3(this.wxSubContextView.position);
        hidePos.y = 1000;
        this.wxSubContextView.position = pos;
        this._showAction = tweenUtil(pos).to(0.5, showPos, { easing: 'Cubic-Out' });
        this._hideAction = tweenUtil(pos).to(0.5, hidePos, { easing: 'Cubic-Out' });

        this.bg.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    initUserInfoButton() {
        if (typeof wx === 'undefined') {
            return;
        }

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                this.tips.string = res.errMsg;
                return;
            }

            this.nickName.string = userInfo.nickName;

            cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, image: ImageAsset) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const sp = new SpriteFrame();
                sp.texture = image._texture;
                this.avatar.spriteFrame = sp;
            });

            wx.getOpenDataContext().postMessage({
                message: "User info get success."
            });

            this._showAction.start();
            this._isShow = true;

            button.hide();
            button.destroy();

        });
    }

    update(dt) {
        if (!this._pos.equals(this.wxSubContextView.position, 0.0001)) {
            this.wxSubContextView.position = this._pos;
        }
    }

    onClick() {
        this._isShow = !this._isShow;
        this._showAction.stop();
        this._hideAction.stop();
        if (this._isShow) {
            this._showAction.start();
        }
        else {
            this._hideAction.start();
        }
    }
}
