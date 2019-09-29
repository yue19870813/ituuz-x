/** 地图格子状态枚举 */
export enum ITMapPosStatus {
    CAN_NOT_MOVE = 0,   // 不能移动   
    CAN_MOVE = 1        // 可移动
}

/** 地图坐标对象 */
export default class ITMapPos {
    public x: number;
    public y: number;
    public status: ITMapPosStatus = ITMapPosStatus.CAN_NOT_MOVE;  // 0: 不能移动， 1: 可移动
    public limit: number = 0;   // 当前点的剩余行动力

    public constructor(x: number, y: number, limit?: number, s?: ITMapPosStatus) {
        this.x = x;
        this.y = y;
        if (s) this.status = s;
        if (limit) this.limit = limit;
    }

    public compare(map: ITMapPos) {

    }

    /** 转成cc.Vec2 */
    public toVec2(): cc.Vec2 {
        return cc.v2(this.x, this.y);
    }
}