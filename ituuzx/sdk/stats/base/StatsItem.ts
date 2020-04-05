/** 打点平台类型 */
export enum StatsType {
    TD = 1,             // TD
    OceanEngine = 2,    // OceanEngine
    Appsflyer = 3,      // Appsflyer
    Flurry  = 4,        // Flurry
    ReYun =5           // ReYun
}

/**
 * 日志打点对象
 * @author ituuz
 */
export default class StatsItem {
    // 打点类型
    public type: StatsType;
    // 名称
    public name: string;
    // appId
    public appId: string;
    // channel
    public channel: string;
    // appName
    public appName: string;
}
