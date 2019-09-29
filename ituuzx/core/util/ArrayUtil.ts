/**
 * ArrayUtil:数组操作相关接口
 * @author ituuz
 */
export default class ArrayUtil {

    public static stringify(src: any[]): string {
        let str = "";
        for (let s of src) {
            str = str + " " + s.toString();
        }
        return str;
    }
}