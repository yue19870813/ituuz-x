/** 广告类型枚举 */
export enum AdType {
    TT_AD = 1,       // 头条广告
    TopOn_Ad = 2,    // TopOn聚合广告
    GDT_Ad = 3,      // GDT广告
    IronSrc_Ad = 4,     // IronSrc 广告
}

/**
 * 广告配置对象
 * @author ituuz
 */
export class AdConfigItem {
    /** 广告类型 */
    public type: AdType;
    /** 广告名称 */
    public name: string;
    /** 广告是否打开 */
    public turnOn: boolean;
    /** 应用id */
    public appId: string;
    /** 应用key */
    public appKey: string;
    /** 激励视频广告位id */
    public advId: string;
    /** banner广告id */
    public bannerId: string;
    /** 开屏广告id */
    public splashId: string;
}
