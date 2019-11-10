/**
 * 数据Model基类
 * @author ituuz
 * @description 封装了数据初始化，消息接发等基本业务逻辑
 */
import BaseModel from "../../core/mvc/base/BaseModel";
import { NetHelper } from "../../extension/net/NetHelper";
import MessageBase from "../../extension/net/MessageBase";

export default class GameModel extends BaseModel {

    /** ❗️禁止重写和调用，除非你知道自己在干什么 */
    public __init__(): void {
        this.registerPB();
        this.init();
    }

    public init(): void {

    }

    // 注册pb
    private registerPB(): void {
        let pbs = this.protobuf();
        for (let pb of pbs) {
            NetHelper.registerRS(pb.pid, pb.cb);
        }
    }

    /**
     * 添加新回调消息
     * @param {number} id 消息id
     * @param {(msg: MessageBase) => void} cb 回调
     */
    public addRS(pid: number, cb: (msg: MessageBase) => void): void {
        NetHelper.registerRS(pid, cb);
    }

    /**
     * 移除消息注册
     * @param {number} id 消息id
     */
    public removeRS(pid: number): void {
        NetHelper.unregisterRS(pid);
    }

    /**
     * 发送消息
     * @param {MessageBase} msg 消息对象 
     */
    public sendRQ(msg: MessageBase): void {
        NetHelper.sendRQ(msg);
    }

    /**
     * 配置注册的PB消息
     */
    public protobuf(): Array<{pid: number, cb: (msg: MessageBase) => void}> {
        return [];
    }

    /** 清理model类 */
    public clear(): void {

    }
}
