import { IBaseStats } from "../base/IBaseStats";
import StatsItem from "../base/StatsItem";

/**
 * Flurry打点的实现类
 * @author ituuz
 */
export default class FlurryStatsImp implements IBaseStats {

    public init(state: StatsItem, versionName?: string): void {
        try {
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/stats/FlurryStats",
                    "initStats",
                    "(Ljava/lang/String;)V",
                    state.appId
                );
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("FlurryStatsManager", "initWithAPIKey:version:", state.appId, versionName);
            }
        } catch (e) {
            it.log("FlurryStatsImp.init error");
        }
    }

    public send(val: string): void {
        // Flurry 不需要打点自定义事件
        try {
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/stats/FlurryStats", "sendStatics", "(Ljava/lang/String;)V", val);
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("FlurryStatsManager", "sendStatics:", val);
            }
        } catch (e) {
            it.log("TDStats.sendStatistics error");
        }
    }
}
