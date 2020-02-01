/**
 * MathUtil: 数学计算相关工具接口
 * @author ituuz
 */
export default class MathUtil {
    /**
     * 误差值
     */
    public static readonly EPSILON: number = 1.0e-6;

    /**
     * 临时点
     */
    private static readonly _TEMP_P = new cc.Vec2();

    /**
     * 获取权重值
     * @param {number[]} list 权重值列表 
     * @return {number} 返回随机到的权重list下标
     */
    public static getWeight(list: number[]): number {
        let count = 0;
        let newList = [];
        for (let w of list) {
            count += w;
            newList.push(count);
        }
        let val = Math.random() * count;
        for (let i = 0; i < newList.length; i++) {
            let cur = newList[i];
            if (val < cur) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 角度转弧度
     * @param deg 角度
     */
    public static readonly DEG_TO_RAD = Math.PI / 180;
    public static degToRad(deg: number): number {
        return deg * MathUtil.DEG_TO_RAD;
    }

    /**
     * 弧度转角度
     * @param rad 弧度
     */
    public static readonly RAD_TO_DEG = 180 / Math.PI;
    public static radToDeg(rad: number): number {
        return rad * MathUtil.RAD_TO_DEG;
    }

    /**
     * 本地坐标变换到世界坐标
     * @param worldPos 世界坐标
     * @param yaw 朝向（角度）
     * @param localPos 本地偏移
     */
    public static localToWorld(worldPos: cc.Vec2, yaw: number, localOffset: cc.Vec2): cc.Vec2 {
        let wp = new cc.Vec2();
        let rad = yaw * MathUtil.DEG_TO_RAD;
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        wp.x = localOffset.x * cos - localOffset.y * sin;
        wp.y = localOffset.x * sin + localOffset.y * cos;
        if(worldPos) {
            wp.x += worldPos.x;
            wp.y += worldPos.y;
        }
        return wp;
    }

    /**
     * 截取变量到指定范围
     * @param v 变量
     * @param min 最小值
     * @param max 最大值
     */
    public static clamp(v: number, min: number, max: number): number {
        if(v < min) v = min;
        if(v > max) v = max;
        return v;
    }

    /**
     * 截取坐标
     * @param p 坐标
     * @param size 大小范围
     */
    public static clampPoint(p: cc.Vec2, size: cc.Vec2): void {
        if(p.x < 0) p.x = 0;
        if(p.y < 0) p.y = 0;
        if(p.x > size.x) p.x = size.x;
        if(p.y > size.y) p.y = size.y;
    }

    /**
     * 求反射向量
     * @param dir 方向
     * @param normal 法线
     */
    public static reflectDirSelf(dir: cc.Vec2, normal: cc.Vec2): void {
        let len = dir.dot(normal) * 2;
        dir.x = dir.x - normal.x * len;
        dir.y = dir.y - normal.y * len;
    }

    /**
     * 根据方向计算角度
     * @param dir 方向
     */
    public static calcYaw(dir: cc.Vec2): number {
        dir.normalizeSelf();
        let a = Math.asin(dir.x);
        if(dir.y < 0) {
            a = Math.PI - a;
        }
        return a * MathUtil.RAD_TO_DEG;
    }

    /**
     * 归一化角度(0 ~ 360)
     * @param yaw 角度
     */
    public static normalizeYaw(yaw: number): number {
        let r = yaw % 360;
        if(r < 0) {
            r += 360;
        }
        return r;
    }

    /**
     * 计算角度差(-180 ~ 180)
     * @param srcYaw 起始角度
     * @param dstYaw 结束角度
     */
    public static calcDeltaYaw(srcYaw: number, dstYaw: number): number {
        let a1 = MathUtil.normalizeYaw(srcYaw);
        let a2 = MathUtil.normalizeYaw(dstYaw);
        let d = a2 - a1;
        if(d < -180) {
            d += 360;
        }
        else if(d > 180) {
            d -= 360;
        }
        return d;
    }

    /**
     * 根据角度计算方向
     * @param yaw 角度
     * @param out 输出方向
     */
    public static calcDir(yaw: number, out: cc.Vec2 = null): cc.Vec2 {
        if(!out) {
            out = new cc.Vec2();
        }
        let rad = MathUtil.degToRad(yaw);
        out.x = Math.sin(rad);
        out.y = Math.cos(rad);
        return out;
    }

    /**
     * 距离平方
     * @param p1 点1
     * @param p2 点2
     */
    public static distSq(p1: cc.Vec2, p2: cc.Vec2): number {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    }

    /**
     * 距离
     * @param p1 点1
     * @param p2 点2
     */
    public static dist(p1: cc.Vec2, p2: cc.Vec2): number {
        let distSq = MathUtil.distSq(p1, p2);
        if(distSq < 1.0-6) {
            return 0;
        }
        return Math.sqrt(distSq);
    }

    /**
     * 插值
     * @param a a
     * @param b b
     * @param t 插值因子
     */
    public static lerp(a: number, b: number, t: number): number {
        return a * (1 - t) + b * t;
    }

    /**
     * 旋转坐标
     * @param p 点
     * @param yaw 朝向
     */
    public static rotatePosSelf(p: cc.Vec2, yaw: number): void {
        let rad = -yaw * MathUtil.DEG_TO_RAD;
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        let x = p.x;
        let y = p.y;
        p.x = x * cos - y * sin;
        p.y = x * sin + y * cos;
    }

    /**
     * 线段相交检测(TODO 交点算法有问题)
     * @param a0 线段a起点
     * @param a1 线段a终点
     * @param b0 线段b起点
     * @param b1 线段b终点
     * @param p 交点
     */
    public static segmentIntersectSegment(a0: cc.Vec2, a1: cc.Vec2, b0: cc.Vec2, b1: cc.Vec2, p: cc.Vec2 = null): boolean {
        let ax = a1.x - a0.x;
        let ay = a1.y - a0.y;
        let bx = b1.x - b0.x;
        let by = b1.y - b0.y;

        // 平行或共线
        let cross = ax * by - ay * bx;
        if (cross > -MathUtil.EPSILON && cross < MathUtil.EPSILON)
        {
            return false;
        }
    
        let dx = b0.x - a0.x;
        let dy = b0.y - a0.y;
        let inv = 1 / cross;

        let s = (dx * ay - dy * ax) * inv;
        if (s < 0 || s > 1)
        {
            return false;
        }
    
        let t = (dx * by - dy * bx) * inv;
        if (t < 0 || t > 1)
        {
            return false;
        }
    
        if(p) {
            p.x = a0.x + s * ax;
            p.y = a0.y + t * ay;
        }
        return true;
    }

    /**
     * 是否相等
     * @param a a
     * @param b b
     */
    public static fEqual(a: number, b: number): boolean {
        let n = a - b;
        if(n > -MathUtil.EPSILON && n < MathUtil.EPSILON) {
            return true;
        }
        return false;
    }

    /**
     * 点到射线的投影
     * @param origin 射线起点
     * @param dir 射线方向（归一化后的）
     * @param p 点
     */
    public static projectRay(origin: cc.Vec2, dir: cc.Vec2, p: cc.Vec2): number {
        MathUtil._TEMP_P.x = p.x - origin.x;
        MathUtil._TEMP_P.y = p.y - origin.y;
        let dot = MathUtil._TEMP_P.dot(dir);
        return dot;
    }
}

// 将接口导出
(<any>window).mi || ((<any>window).mi = {});
(<any>window).mi.math = {};
(<any>window).mi.math.weight = MathUtil.getWeight;
