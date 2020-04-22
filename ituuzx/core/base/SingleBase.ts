
export default class SingleBase {
    /** 
     * 获取实例 
     */
    public static getInstance<T extends SingleBase>(this: new () => T): T {
        if ( !(this as any).instance ) {
            (this as any).instance = new this();
        }
        return (this as any).instance;
    }

    /**
     * init
     */
    public init() {
    }

    /**
     * tick
     * @param dt 时间间隔
     */
    public tick(dt: number) {
    }
}
