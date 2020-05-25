/**
 * 消息协议基类
 * @author ituuz
 */
export default class MessageBase {

    public static create(cb: (msg: MessageBase) => void) {

    }

    public static loadPbFile(cb: () => {}): void {
    }

    public toBuffer(): any {
        return null;
    }

    public parseBuffer(buffer): void {
    }

    public getObject(): any {
        return null;
    }

    public setObject(obj: any): void {
    }

    // 协议pid
    public get PID(): number {
        return -1;
    }
}
