/**
 * 网络消息处理Helper
 * @author ituuz
 * @description 主要负责网络消息的注册监听，发送，和链接类型管理
 * @warn ️️不要直接调用该类进行消息处理，应使用上层的Model进行处理
 */
import LogUtil from "../../core/util/LogUtil";
import HttpClient from "./HttpClient";
import LocalClient from "./LocalClient";
import MessageBase from "./MessageBase";
import NetClientBase from "./NetClientBase";
import WebsocketClient from "./WebsocketClient";
import PBUtils from "./PBUtils";

/**
 * 网络类型
 */
export enum NetType {
    LOCAL           = 1,    // 本地存储
    HTTP            = 2,    // http短链接
    WEBSOCKET       = 3,    // websocket长链接
    COUSTOM         = 99    // 自定义网络实现
}

/**
 * 网络失败代码
 */
export enum NetFailCode {
    NOT_INIT        = 1001    // 网络未初始化
}

/**
 * 网络客户端基类
 * @author Yue
 */
export class NetHelper {
    // 是否初始化
    private static _INIT: boolean = false;
    // 远程地址
    private static _ADDR: string;
    // 远程端口
    private static _PORT: number;
    // 网络类型
    private static _TYPE: NetType;
    // 客户端网络对象
    private static _CLIENT: NetClientBase;
    // 协议映射关系
    private static _RS_MAP: Map<number, new() => MessageBase>;
    // 协议监听函数
    private static _CB_MAP: Map<number, (msg: MessageBase) => void> = new Map();

    /**
     * 初始化网络链接
     * @param {NetType} type 链接类型
     * @param {string} addr 链接地址
     * @param {number} port 端口
     * @param {rsMap: Map<number, {new(): MessageBase}>} rsMap 协议映射关系表
     * @param {new() => NetClientBase} customClient 自定义client类型，可选
     */
    public static init(type: NetType, addr: string, port: number, rsMap: Map<number, new() => MessageBase>,
                       customClient?: new(addr: string, port: number) => NetClientBase): void {
        NetHelper._INIT = true;
        NetHelper._ADDR = addr;
        NetHelper._PORT = port;
        NetHelper._TYPE = type;
        NetHelper._RS_MAP = rsMap;
        // 初始化PB工具类
        PBUtils.init();
        // 实例化对应网络客户端
        switch (NetHelper._TYPE) {
            case NetType.HTTP:
                NetHelper._CLIENT = new HttpClient(addr, port);
                break;
            case NetType.LOCAL:
                NetHelper._CLIENT = new LocalClient(addr, port);
                break;
            case NetType.WEBSOCKET:
                NetHelper._CLIENT = new WebsocketClient(addr, port);
                break;
            default:
                if (customClient) {
                    NetHelper._CLIENT = new customClient(addr, port);
                    return;
                }
                LogUtil.error(`[NetHelper] type: ${type} is not exist!`);
                NetHelper._INIT = false;
        }
    }

    /** 加载pb文件 */
    public static loadPbFiles(cb: () => void): void {
        let count = 0;
        NetHelper._RS_MAP.forEach((value: new() => MessageBase, key, map) => {
            (value as any).loadPbFile(() => {
                count ++;
                if (count >= NetHelper._RS_MAP.size) {
                    if (cb) { cb(); }
                }
            });
        });
    }

    /**
     * 链接
     * @param {() => void} succCB 连接成功回调
     * @param {(code: NetFailCode) => void} faultCB 链接失败回调
     */
    public static connect(succCB: () => void, faultCB: (code: NetFailCode) => void): void {
        if (!NetHelper._INIT) {
            LogUtil.warn("NetHelper is not init.");
            if (faultCB) { faultCB(NetFailCode.NOT_INIT); }
            return;
        }
        NetHelper._CLIENT.connect(succCB, faultCB);
    }

    /**
     * 发送消息
     * @param {MessageBase} msg 消息对象 
     */
    public static sendRQ(msg: MessageBase): void {
        NetHelper._CLIENT.sendReq(msg);
    }

    /**
     * 注册回调消息
     * @param {number} id 消息id
     * @param {(msg: MessageBase) => void} cb 回调
     */
    public static registerRS(id: number, cb: (msg: MessageBase) => void): void {
        // 注册
        NetHelper._CB_MAP.set(id, cb);
    }

    /**
     * 移除消息注册
     * @param {number} id 消息id
     */
    public static unregisterRS(id: number): void {
        NetHelper._CB_MAP.delete(id);
    }

    /**
     * 派发消息
     * @param {number} pid 消息id
     * @param {MessageBase} msg 消息对象
     */
    public static dispatcher(pid: number, msg: MessageBase): void {
        let cb = NetHelper._CB_MAP.get(pid);
        if (cb) { cb(msg); }
    }

    /**
     * 获取消息类
     * @param {number} pid 消息协议id
     */
    public static getMessageCls(pid: number): new() => MessageBase {
        return NetHelper._RS_MAP.get(pid);
    }
}
