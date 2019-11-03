import MessageBase from "./MessageBase";

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

    public abstract sendReq(msg: MessageBase): void;
}