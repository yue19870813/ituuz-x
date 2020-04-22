/**
 * ArrayUtil:数组操作相关接口
 * @author ituuz
 */
export default class ArrayUtil {

    public static stringify(src: any[]): string {
        let str = "";
        for (let s of src) {
            str = str + " " + ArrayUtil.toString(s);
        }
        return str;
    }

    public static toString(s: any): string {
        if (s == null) {
            return "null";
        } else if (s === undefined) {
            return "undefined";
        // tslint:disable-next-line: use-isnan
        } else if (s === NaN) {
            return "NaN";
        } else {
            return s.toString();
        }
    }

    /**
     * clone数组
     * @param list 目标数组，基本类型可以直接clone，对象类型需要对象有clone接口；
     */
    public static clone<T>(list: T[]): T[] {
        let newList = new Array<T>();
        for (let o of list) {
            let temp;
            if (typeof o === "object") {
                temp = (o as any).clone();
            } else {
                temp = o;
            }
            newList.push(o);
        }
        return newList;
    }

    /**
     * 数组内容相加, 并返回一个新数组
     * @param list1 
     * @param list2 
     */
    public static listAddList(list1: number[], list2: number[]): number[] {
        let newList: number[] = [];
        if (list1.length !== list2.length) {
            it.warn("两个数组长度不同，不能相加。");
            return null;
        }
        for (let i = 0; i < list1.length; i++) {
            let newValue = list1[i] + list2[i];
            newList.push(newValue);
        }
        return newList;
    }
}
