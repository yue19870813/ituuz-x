import NetClientBase from "./NetClientBase";
import MessageBase from "./MessageBase";
import { NetFailCode } from "./NetHelper";
/**
 * WebsocketClient
 * @author ituuz
 */
export default class WebsocketClient extends NetClientBase {
    public sendReq(msg: MessageBase): void {
        throw new Error("Method not implemented.");
    }

    public connect(succCB: () => void, faultCB: (code: NetFailCode) => void): void {
        if (succCB) {
            succCB();
        }
    }

}
