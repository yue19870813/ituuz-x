import StateItem, { StatsType } from "./base/StatsItem";
import { IBaseStats } from "./base/IBaseStats";
import TDStatsImp from "./imp/TDStatsImp";
import FlurryStatsImp from "./imp/FlurryStatsImp";

/** 发送打点的数据类型 */
export class StatsData {
    /** 渠道 */
    public channel: string;
    /** 打点类型 */
    public type: string;
    /** 玩家等级 */
    public level: string;
    /** 版本 */
    public version: string;
    /** 打点时间 */
    public time: string;
    /** 用户id */
    public uid: string;
    /** 来源 */
    public origin: string;
    /** 其他自定义数据 */
    public allData: string;

    public constructor(type: string) {
        this.type = type;
    }
}

/**
 * 日志打点管理类
 * @author ituuz
 */
export default class StatsManager {
    // 是否已经初始化
    private static _init: boolean = false;
    // 打点实例列表
    private static _stateList: IBaseStats[];

    /** 初始化sdk */
    public static init(states: StateItem[], versionName: string, userId: string): void {
        if (!cc.sys.isNative) {
            it.warn("非原生平台，不能初始化原生stats."); // 热云net 可以初始化 
            StatsManager._stateList = [];
            for (let state of states) {
                if (state.type === StatsType.ReYun) {
                    let cls = StatsManager.getClsByType(state.type);
                    let st = new cls();
                    st.init(state, versionName, userId);
                    StatsManager._stateList.push(st);
                }
            }
            return;
        }
        if (StatsManager._init) {
            it.warn("打点已经初始化.");
            return;
        }
        StatsManager._init = true;
        StatsManager._stateList = [];
        for (let state of states) {
            let cls = StatsManager.getClsByType(state.type);
            let st = new cls();
            if (state.type === StatsType.ReYun) {
                st.init(state, versionName, userId);
            } else {
                st.init(state, versionName);
            }
            StatsManager._stateList.push(st);


        }
    }

    /**
     * 打点日志发送接口
     * @param {StateData} data 打点数据 
     */
    public static send(data: StatsData): void {
        if (!cc.sys.isNative) {
            it.warn("非原生平台，不能发送stats.");
            return;
        }
        if (!StatsManager._init) {
            it.error("打点还没有初始化.");
            return;
        }
        let str = JSON.stringify(data);
        for (let state of StatsManager._stateList) {
            state.send(str);
        }
    }

    /** 根据类型获取实现类 */
    private static getClsByType(type: StatsType): new () => IBaseStats {
        switch (type) {
            case StatsType.TD:
                return TDStatsImp;
            case StatsType.Flurry:
                return FlurryStatsImp;
        }
        return TDStatsImp;
    }
}
