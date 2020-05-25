import { IBaseStats } from "../base/IBaseStats";
import StateItem from "../base/StatsItem";

/**
 * TD打点实现类
 * @author ituuz
 */
export default class TDStatsImp implements IBaseStats {

    public init(state: StateItem): void {
        try {
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/stats/TalkingDataStats",
                    "initStats",
                    "(Ljava/lang/String;Ljava/lang/String;)V",
                    state.appId,
                    state.channel
                );
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("TalkingDataManager", "initStatsAppId:channel:", state.appId, state.channel);
            }
        } catch (e) {
            it.log("TDStats.initStatsSdk error");
        }
    }

    public send(val: string): void {
        try {
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/stats/TalkingDataStats", "sendStatics", "(Ljava/lang/String;)V", val);
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isMobile && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("TalkingDataManager", "sendStatics:", val);
            }
        } catch (e) {
            it.log("TDStats.sendStatistics error");
        }
    }

}
