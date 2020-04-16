

export type MessageReceiver = (data: Uint8Array) => void;

export class Broadcast {
    public broadcast(nickName: string, data: Uint8Array) {
        this._receivers.forEach((receiver, name) => {
            if (nickName !== name) {
                receiver(data);
            }
        });
    }

    public register(nickName: string, receiver: MessageReceiver) {
        this._receivers.set(nickName, receiver);
    }

    private _receivers: Map<string, MessageReceiver> = new Map();
}

export const globalBroadcast = new Broadcast();