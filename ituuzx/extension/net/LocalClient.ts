import NetClientBase from "./NetClientBase";
import MessageBase from "./MessageBase";
/**
 * LocalClient本地存储
 * @author ituuz
 */
export default class LocalClient extends NetClientBase {
    public sendReq(msg: MessageBase): void {
        throw new Error("Method not implemented.");
    }
    
}