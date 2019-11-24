import MessageBase from "./MessageBase";
import { NetFailCode } from "./NetHelper";

/**
 * 网络客户端基类
 * @author ituuz
 */
export default abstract class NetClientBase {
    /** 连接地址 */
    public addr: string;
    /** 端口 */
    public port: number;

    /** 构造函数 */
    public constructor(addr: string, port: number) {
        this.addr = addr;
        this.port = port;
    }

    /** 发送消息 */
    public abstract sendReq(msg: MessageBase): void;

    /** 创建连接 */
    public abstract connect(succCB: () => void, faultCB: (code: NetFailCode) => void): void;

}