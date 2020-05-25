/**
 * 单例基类，继承该类的子类就可以用单例工厂SingleFactory获取单例对象了
 * @author ituuz
 * @example
 *      class Test extends SingleBase {
 *          public test() {
 *              it.log("我是单例对象");
 *          }
 *      }
 *      let t = SingleFactory.getInstance(Test);
 *      t.test();
 */
export class SingleBase {
    private static _instance: any = null;
    /** 初始化接口，子类可以重写实现 */
    public init(): void {
    }

    /** 清理接口，子类可以重写实现 */
    public clear(): void {
    }
}

/**
 * 单例工厂
 * @author ituuz
 */
export class SingleFactory {
    /** 单例对象列表 */
    private static _instanceList: Map<new() => SingleBase, SingleBase> = new Map();

    /**
     * 获取单例对象
     * @param type 类型
     */
    public static getInstance<T extends SingleBase>(type: new() => T): T {
        // tslint:disable-next-line: no-string-literal
        if (!type["_instance"]) {
            let target = new type();
            // tslint:disable-next-line: no-string-literal
            type["_instance"] = target;
            target.init();
            SingleFactory._instanceList.set(type, target);
            return target;
        }
        // tslint:disable-next-line: no-string-literal
        return type["_instance"];
    }

    /**
     * 释放指定的单例对象
     * @param type 类型
     */
    public static clear<T extends SingleBase>(type: new() => T): void {
        // tslint:disable-next-line: no-string-literal
        if (type["_instance"]) {
            // tslint:disable-next-line: no-string-literal
            type["_instance"].clear();
            // tslint:disable-next-line: no-string-literal
            type["_instance"] = null;
        }
    }

    /**
     * 清理所有的单例对象
     * @author ituuz
     */
    public static clearAll(): void {
        let keys = SingleFactory._instanceList.keys();
        let keyList = Array.from(keys);
        for (let k of keyList) {
            let target = SingleFactory._instanceList.get(k);
            target.clear();
            SingleFactory._instanceList.delete(k);
        }
    }
}

// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.instance = SingleFactory.getInstance;
