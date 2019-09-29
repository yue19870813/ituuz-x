/**
 * JSUtil:操作js相关接口.
 * @author ituuz
 * @desc 根据字符串创建对象,判断是否是派生类等接口.
 */
export default class JSUtil {

    /**
     * 根据字符串创建对象
     * @param {string} cls 类的字符串值
     */
    public static importCls(cls: string): Promise<any> {
        return new Promise<any>((resolve, reject)=>{
            import(cls).then((module)=>{
                if (module && module.default) {
                    resolve(module.default);
                } else {
                    console.error(cls, "中没有default类.");
                    reject(module);
                }
            });
        });
    }

    /**
     * 获取父类
     * @param {Object} ctor 子类类名
     * @return {Object}
     */
    public static getSuper (ctor) {
        let proto = ctor.prototype;
        let dunderProto = proto && Object.getPrototypeOf(proto);
        return dunderProto && dunderProto.constructor;
    }

    /**
     * 判断subclass是否是superclass的子类
     * @param subclass
     * @param superclass
     */
    public static isChildClassOf (subclass, superclass) {
        if (subclass && superclass) {
            if (typeof subclass !== 'function') {
                return false;
            }
            if (typeof superclass !== 'function') {
                return false;
            }
            if (subclass === superclass) {
                return true;
            }
            for (;;) {
                subclass = JSUtil.getSuper(subclass);
                if (!subclass) {
                    return false;
                }
                if (subclass === superclass) {
                    return true;
                }
            }
        }
        return false;
    }
}