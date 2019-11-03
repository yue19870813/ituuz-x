/**
 * 消息协议基类，声明的pb文件会生成对应的message类文件供业务使用。
 * @author ituuz
 */
export default class MessageBase {
    public static create(cb: () => void): MessageBase {
        return null;
    }

    /**
     * 将消息体转成ArrayBuff
     */
    public toBuffer(): any {
        return null;
    }

    /**
     * 将ArrayBuff转成消息对象
     * @param buffer 
     */
    public parseBuffer(buffer: any): void {
    }

    // 返回协议pid
    public get PID(): number {
        return -1;
    }
}