import { _decorator, Component, CameraComponent, Node, Vec3, Scene, CanvasComponent, LabelComponent, systemEvent, SystemEventType, EventTouch, geometry, ModelComponent, Color, randomRange, HorizontalTextAlignment } from 'cc';
import { globalBroadcast } from './Broadcast';

const v = new Vec3();
const textShowTime = 3;
const textFacadeTime = 1;
const textLife = textShowTime + textFacadeTime;

@_decorator.ccclass('Guy')
export class Guy extends Component {
    @_decorator.property
    nickName: string = '';

    @_decorator.property({ type: CameraComponent })
    public mainCamera: CameraComponent | null = null;

    @_decorator.property({ type: Node })
    public canvasNode: Node | null = null;

    private _modelComponent: ModelComponent | null = null;
    private _billboardNode: Node | null = null;
    private _label: LabelComponent | null = null;
    private _ray: geometry.Ray = new geometry.Ray();
    private _textLiveTime = 0;
    
    start() {
        if (this.canvasNode === null) {
            throw new Error(`Canvas not specified!`);
        }

        this._modelComponent = this.getComponent(ModelComponent);

        const billboardNode = new Node(`Billboard-${this.nickName}`);
        this.canvasNode.addChild(billboardNode);
        this._label = billboardNode.addComponent(LabelComponent);
        this._label.string = `我是 ${this.nickName}`
        this._label.color = new Color(0, 0, 0);
        this._label.fontSize = 15;
        this._label.horizontalAlign = HorizontalTextAlignment.LEFT;
        this._label.lineHeight = this._label.lineHeight / 2;
        this._billboardNode = billboardNode;

        globalBroadcast.register(this.nickName, (data) => {
            this._onReceived(data);
        });
    }

    update (deltaTime: number) {
        if (this._textLiveTime === 0) {
            return;
        }

        this._textLiveTime -= deltaTime;
        if (this._textLiveTime > textFacadeTime) {
            return;
        }
        
        if (this._textLiveTime <= 0) {
            this._textLiveTime = 0;
        }

        const alpha = this._textLiveTime / textFacadeTime;
        if (alpha === 0) {
            this._printPermanentMessage(`我是 ${this.nickName}`);
        } else {
            this._updateLabelAlpha(alpha);
        }
    }

    lateUpdate (deltaTime: number) {
        if (this._billboardNode) {
            this.node.getWorldPosition(v);
            this.mainCamera.convertToUINode(v, this._billboardNode.parent, v);
            this._billboardNode.setPosition(v);
        }
    }

    onEnable () {
        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable () {
        systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart (touch: Touch, event: EventTouch) {
        this.mainCamera.screenPointToRay(touch._point.x, touch._point.y, this._ray);
        if (geometry.intersect.ray_model(this._ray, this._modelComponent.model)) {
            this._send();
        } else {
            
        }
    }

    private _send() {
        this._printFacadeMessage(`${this.nickName} 发送了一条广播消息。`);
        const data = awesome.AwesomeMessage.encode(generateRandomMessage()).finish();
        globalBroadcast.broadcast(this.nickName, data);
    }

    private _onReceived(data: Uint8Array) {
        try {
            const message = awesome.AwesomeMessage.decode(data);
            this._printFacadeMessage(`${this.nickName} 收到广播消息: ${JSON.stringify(message, undefined, 2)}`);
        } catch (err) {
            if (err instanceof protobuf.util.ProtocolError) {
    
            } else {
    
            }
        }
    }

    private _printPermanentMessage(message: string) {
        if (this._label) {
            this._label.string = message;
            this._textLiveTime = 0;
            this._updateLabelAlpha(1.0);
        }
    }

    private _printFacadeMessage(message: string) {
        if (this._label) {
            this._label.string = message;
            this._textLiveTime = textLife;
            this._updateLabelAlpha(1.0);
        }
    }

    private _updateLabelAlpha(alpha: number) {
        const c = this._label.color.clone();
        c.a = alpha * 255;
        this._label.color = c;
    }
}

function generateRandomMessage(): awesome.IAwesomeMessage {
    return {
        name: 'Jack',
        age: randomRange(1, 29),
    };
}