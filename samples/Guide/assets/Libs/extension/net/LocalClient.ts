import NetClientBase from "./NetClientBase";
import MessageBase from "./MessageBase";
import { NetFailCode } from "./NetHelper";
/**
 * LocalClient本地存储
 * @author ituuz
 */
export default class LocalClient extends NetClientBase {

    public connect(succCB: () => void, faultCB: (code: NetFailCode) => void): void {
        if (succCB) {
            succCB();
        }
    }
    public sendReq(msg: MessageBase): void {
        throw new Error("Method not implemented.");
    }

}
