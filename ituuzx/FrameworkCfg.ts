/**
 * 框架配置，通过init接口初始化这些配置。
 */
export default class FrameworkCfg {
    /** 是否是测试环境 */
    public static DEBUG = false;
    /** 默认的设计分辨率 */
    public static DESIGN_RESOLUTION: cc.Size = cc.size(640, 960);
    /** 是否高适配 */
    public static FIT_HEIGHT: boolean = true;
    /** 是否宽适配 */
    public static FIT_WIDTH: boolean = false;
}