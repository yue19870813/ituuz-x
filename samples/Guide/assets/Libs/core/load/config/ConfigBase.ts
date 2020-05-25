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
     * 根据"|"分割字符串，返回number数组
     * @param {string} row 字符串
     */
    public static parseNumArr(row: string): number[] {
        let res: number[] = [];
        let temp = row.split("|");
        for (let v of temp) {
            if (v === "") { continue; }
            res.push(Number(v));
        }
        return res;
    }

    /**
     * 根据"|"和":"分割二维数组
     * @param {string} row 字符串
     */
    public static parseNumArr2(row: string): number[][] {
        let res = new Array<number[]>();
        let temp = row.split("|");
        for (let v of temp) {
            if (v === "") { continue; }
            let inner = v.split(":");
            let innerArr = new Array<number>();
            for (let vv of inner) {
                innerArr.push(Number(vv));
            }
            res.push(innerArr);
        }
        return res;
    }

    /**
     * 根据"|"和":"分割二维数组
     * @param {string} row 字符串
     */
    public static parseStrArr2(row: string): string[][] {
        let res = new Array<string[]>();
        let temp = row.split("|");
        for (let v of temp) {
            if (v === "") { continue; }
            let inner = v.split(":");
            res.push(inner);
        }
        return res;
    }

    /**
     * 根据"|"分割, 返回cc.Vec2
     * @param {string} row row 字符串
     */
    public static parseVec2(row: string): cc.Vec2 {
        let temp = row.split("|");
        if (temp.length !== 2) {
            it.error("数据格式错误：", row);
        }
        return cc.v2(Number(temp[0]), Number(temp[1]));
    }

    /**
     * 根据"|"和":"分割一维cc.Vec2数组
     * @param {string} row row 字符串
     */
    public static parseVec2Arr(row: string): cc.Vec2[] {
        let res = new Array<cc.Vec2>();
        let temp = row.split("|");
        for (let v of temp) {
            if (v === "") { continue; }
            let inner = v.split(":");
            if (inner.length !== 2) {
                it.error("数据格式错误：", row);
                continue;
            }
            res.push(cc.v2(Number(inner[0]), Number(inner[1])));
        }
        return res;
    }

    /**
     * 根据"#"和"|"和":"分割二维cc.Vec2数组
     * @param {string} row row 字符串
     */
    public static parseVec2Arr2(row: string): cc.Vec2[][] {
        let res = new Array<cc.Vec2[]>();
        let temp = row.split("#");
        for (let v of temp) {
            if (v === "") { continue; }
            let vectors = v.split("|");
            let innerRes = new Array<cc.Vec2>();
            for (let vec of vectors) {
                let inner = vec.split(":");
                if (inner.length !== 2) {
                    it.error("数据格式错误：", row);
                    continue;
                }
                innerRes.push(cc.v2(Number(inner[0]), Number(inner[1])));
            }
            res.push(innerRes);
        }
        return res;
    }

    public static path(): string {
        return "";
    }
}
