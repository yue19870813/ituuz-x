import MessageBase from "./MessageBase";
import { NetFailCode } from "./NetHelper";

/**
 * 网络客户端基类
 * @author ituuz
 */
export default abstract class NetClientBase {

    public addr: string;

    public port: number;

    public constructor(addr: string, port: number) {
        this.addr = addr;
        this.port = port;
    }

    public abstract sendReq(msg: MessageBase, opt?: any): void;

    public abstract connect(succCB: () => void, faultCB: (code: NetFailCode) => void): void;
}
