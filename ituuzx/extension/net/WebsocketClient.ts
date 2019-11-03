import NetClientBase from "./NetClientBase";
import MessageBase from "./MessageBase";
/**
 * WebsocketClient
 * @author ituuz
 */
export default class WebsocketClient extends NetClientBase {
    public sendReq(msg: MessageBase): void {
        throw new Error("Method not implemented.");
    }
    
}