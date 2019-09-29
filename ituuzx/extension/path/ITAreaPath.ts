import ITMapPos, {ITMapPosStatus} from "./ITMapPos";
/**
 * 范围寻路，用于战旗游戏，查找角色可移动范围
 * @author ituuz
 */
export default class ITAreaPath {
    
    /** 地图数据 */
    private _mapData: Map<string, number>;
    /** 地图配置数据 */
    private _mapCfg: Map<number, number>;
    /** 不能移动的边缘地格 */
    private _canntList: ITMapPos[] = [];
    /** 当前移动对象的配置，用于配置目标擅长或者劣势地形，默认为空 */
    private _targetCfg: Map<number, number>;
    /** 最低移动步数，当前移动对象至少移动的步数，默认为1步 */
    private _minStep: number = 1;

    /**
     * 初始化地图配置，注意地形类型不要设定为0，推荐为大于0的整数，算法中0作为默认值存在。
     * @param {Map<string, number>} mapData 地图数据，map的key是地图坐标x + “_” + y, value是地面类型；
     * @param {Map<number, number>} mapCfg 地形配置，对应类型消耗的行动力；默认为消耗1行动力地形；
     */
    initMapConfig(mapData: Map<string, number>, mapCfg?: Map<number, number>, minStep?: number) {
        this._mapData = mapData;
        if (mapCfg) {
            this._mapCfg = mapCfg;
        } else {
            this._mapCfg = new Map<number, number>();
            this._mapCfg.set(1, 1);
        }
        if (minStep) {
            this._minStep = minStep;
        }
    }

    /**
     * 获取移动数据
     * @param {cc.Vec2} pos 移动原点 
     * @param {number} limit 行动力
     * @param {Map<number, number>} targetCfg 当前移动对象的配置，用于配置目标擅长或者劣势地形，默认为空(可选)
     * @param {boolean} isShowEdge 是否返回不能移动的边缘数据，默认为不返回(可选)
     */
    getCanMoveData(pos: cc.Vec2, limit: number, targetCfg?: Map<number, number>,
                    isShowEdge: boolean = false): ITMapPos[] {
        if (targetCfg) {
            this._targetCfg = targetCfg;
        } else {
            this._targetCfg = null;
        }
        // 存储可移动坐标的结果数组
        let resultPos: ITMapPos[] = [];
        // 将原点存入结果
        let center = new ITMapPos(pos.x, pos.y, 0, ITMapPosStatus.CAN_MOVE);
        resultPos.push(center);
        let stepCount = 0;
        let start = 0;
        // 逐步判断
        while (stepCount < limit) {
            start = this.scanMap(resultPos, limit, start);
            stepCount++;
        }
        // 是否显示不可移动的边缘
        if (isShowEdge) {
            let r = resultPos.concat(this._canntList);
            this._canntList = [];
            return r;
        } else {
            return resultPos;
        }
    }

    /**
     * 开始扫描地图
     * @param {ITMapPos[]} resultPos 结果列表
     * @param {number} limitStep 行动力
     * @param {number} start 当前检索的起始位置，优化算法使用
     */
    scanMap(resultPos: ITMapPos[], limitStep: number, start: number) {
        let len = resultPos.length;
        for (; start < resultPos.length; start++) {
            let pos = resultPos[start];
            // 检查四个方向
            this.checkMapPos(new ITMapPos(pos.x, pos.y - 1, pos.limit), resultPos, limitStep);   // 上
            this.checkMapPos(new ITMapPos(pos.x, pos.y + 1, pos.limit), resultPos, limitStep);   // 下
            this.checkMapPos(new ITMapPos(pos.x - 1, pos.y, pos.limit), resultPos, limitStep);   // 左
            this.checkMapPos(new ITMapPos(pos.x + 1, pos.y, pos.limit), resultPos, limitStep);   // 右
        }
        return len;
    }

    /**
     * 检查指定坐标点能否移动
     * @param {ITMapPos} pos 目标坐标点
     * @param {ITMapPos[]} resultPos 结果列表
     * @param {number} limit 行动力
     */
    checkMapPos(pos: ITMapPos, resultPos: ITMapPos[], limit: number) {
        // 判断该点是否有效、是否以加入可行动队列、行动力是否足够
        if (pos.x > 0 && pos.y > 0) {
            let targetPos = this._mapData.get(pos.x + "_" + pos.y);
            if (targetPos) {
                let newPos = resultPos.find((p: ITMapPos) => {
                    return (p.x === pos.x && p.y === pos.y);
                });
                if (!newPos) {
                    let value = pos.limit + this.getStepByType(targetPos) 
                                + this.getTargetStepByType(targetPos);
                    if (value <= 0) {
                        // 如果计算的最终步数小于等于0，那么移动最小步数。
                        value = this._minStep;
                    }
                    if (value <= limit) {
                        pos.limit = value;
                        pos.status = ITMapPosStatus.CAN_MOVE;
                        resultPos.push(pos);
                    } else {
                        pos.status = ITMapPosStatus.CAN_NOT_MOVE;
                        this._canntList.push(pos);
                    }
                }
            } else {
                console.log("位置:", pos.x, pos.y, "值为:", targetPos, "不能移动");
            }
        }
    }

    /**
     * 根据指定地形获取该地形消耗的行动力
     * @param type 地形类型
     */
    getStepByType(type: number): number {
        let step = this._mapCfg.get(type);
        if (step > 0) {
            return step;
        }
        console.warn("该类型地形不存在:", type);
        return 999999;
    }

    /**
     * 根据指定地形获取当前对象的优劣行动力增量
     * @param type 地形
     */
    getTargetStepByType(type: number): number {
        if (this._targetCfg) {
            let step = this._targetCfg.get(type);
            if (step >= 0) {
                return step;
            }
        }
        return 0;
    }
    
}

    