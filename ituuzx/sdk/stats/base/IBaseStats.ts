import StatsItem from "./StatsItem";

/**
 * 日志打点接口
 * @author ituuz 
 */
export interface IBaseStats {
    /**
     * 初始化sdk
     * @param {StatsItem} state 打点对象
     * @param {string} versionName 版本名称
     * @param {string} userId 用户唯一标志
     */
    init(state: StatsItem, versionName?: string, userId?: string): void;

    /**
     * 发送打点
     * @param {string} val 打点数据
     */
    send(val: string): void;
}
