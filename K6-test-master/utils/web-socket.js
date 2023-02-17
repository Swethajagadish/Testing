import ws from "k6/ws";

export class WebSocketExecutor {
    constructor({ name, url }) {
        this.name = name;
        this.url = url;
        this._onConnectFunc = () => {};
        this._onMessageFunc = () => {};
        this._onDisconnectFunc = () => {};
    }

    start() {
        console.log(`WS(${this.name}): starting exec`);
        console.log("url", this.url);

        const caller = this; // this inside ws.connect is something else;
        const res = ws.connect(this.url, function (socket) {
            socket.on("open", () => {
                console.log(`WS(${caller.name}): connected`);
                if (caller._onConnectFunc) {
                    caller._onConnectFunc.call();
                }
            });
            socket.on("message", (data) => {
                console.log(`WS(${caller.name}): message received: `, data);
                if (caller._onMessageFunc) {
                    caller._onMessageFunc.call(caller, data.toString());
                }
            });
            socket.on("close", () => {
                console.log(`WS(${caller.name}): disconnected, calling onDisconnect`);
                if (caller._onDisconnectFunc) {
                    caller._onDisconnectFunc.call();
                }
                console.log(`WS(${caller.name}): disconnect complete`);
            });
        });
    }

    onConnect(onConnectFunc) {
        this._onConnectFunc = onConnectFunc;
        return this;
    }
    onMessage(onMessageFunc) {
        this._onMessageFunc = onMessageFunc;
        return this;
    }
    onDisconnect(onDisconnectFunc) {
        this._onDisconnectFunc = onDisconnectFunc;
        return this;
    }
}

// const WebSocketExecutorImpl = WebSocketExecutor;
// export default WebSocketExecutorImpl;
