/**
 * 静态数据加载基类
 * @author ituuz
 */
export default abstract class ConfigBase {

    /**
     * @override
     * 加载数据接口, 需要子类重写.
     * @param data 数据
     */
    public static loadData(data: string): void {
        
    }

    /**
     * 根据":"分割字符串，返回number数组
     * @param {string} row 字符串
     */
    public static parseNumArr(row: string): number[] {
        let res: number[] = [];
        let temp = row.split(":");
        for (let v of temp) {
            res.push(Number(v));
        }
        return res;
    }
}