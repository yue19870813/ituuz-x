import { ViewManager } from "../../core/mvc/manager/ViewManager";
import AudioUtil from "../../core/util/AudioUtil";
import GameView from "../../mvc_ex/base/GameView";
import { AdConfigItem, AdType } from "./base/AdConfigItem";
import { IBaseAd } from "./base/IBaseAd";
import TTAdImp from "./imp/TTAdImp";

/** 广告状态 */
export enum AdStatus {
    PLAY_SUCC = 1,  // 播放成功
    PLAY_FAIL = 2,  // 播放失败
    PLAY_CLOSE = 3, // 关闭
    PLAY_START = 4, // 开始播放
    PLAY_SKIP = 5   // 跳过
}

/**
 * 广告管理类
 */
export class AdManager {
    // 是否初始化
    private static _isInit: boolean = false;
    // 当前广告sdk
    private static _curAdImp: IBaseAd = null;
    // 全局广告测试属性
    private static _debug: boolean = false;
    // 当前广告配置
    private static _cfg: AdConfigItem = null;
    // banner广告打开标志位
    private static _bannerFlag: boolean = true;

    /** 初始化广告sdk */
    public static init(cfg: AdConfigItem, cb: () => void): void {
        if (!cc.sys.isNative) {
            it.log(`当前平台:${cc.sys.os}，不是原生平台，不能调用广告sdk。`);
            return;
        }
        if (AdManager._debug) {
            it.log(`debug = ${AdManager._debug}，当前为debug模式`);
            return;
        }
        it.log("AdManager==========init");
        if (AdManager._isInit) {
            it.error("广告已经初始化");
            return;
        }
        AdManager._cfg = cfg;
        // 创建广告实现类并初始化sdk
        let cls = AdManager.getImpClsByType(cfg.type);
        AdManager._curAdImp = new cls();
        AdManager._curAdImp.initAdSdk(cfg, cb);
    }

    /**
     * 增加手动load广告接口
     * @param {string} userId 用户唯一标志符
     */
    public static loadVideoAd(userId: string): void {
        if (!cc.sys.isNative) {
            it.log(`当前平台:${cc.sys.os}，不是原生平台，不能加载激励视频广告。`);
            return;
        }
        if (AdManager._debug) {
            it.log(`debug = ${AdManager._debug}，当前为debug模式`);
            return;
        }
        if (AdManager._cfg.advId === "") {
            it.log(`AdManager._cfg.advId = ${AdManager._cfg.advId}，不加载激励视频`);
            return;
        }
        AdManager._curAdImp.loadAd(AdManager._cfg.advId, userId);
    }

    /** 播放激励视频广告 */
    public static showVideoAd(cb?: (status: AdStatus) => void): void {
        if (!cc.sys.isNative) {
            it.log(`当前平台:${cc.sys.os}，不是原生平台，不能播放激励视频广告。`);
            if (cb) { cb(AdStatus.PLAY_SUCC); }
            return;
        }
        if (AdManager._debug) {
            it.log(`debug = ${AdManager._debug}，当前为debug模式`);
            if (cb) { cb(AdStatus.PLAY_SUCC); }
            return;
        }
        if (AdManager._cfg.advId === "") {
            it.log(`AdManager._cfg.advId = ${AdManager._cfg.advId}，不播放激励视频`);
            if (cb) { cb(AdStatus.PLAY_SUCC); }
            return;
        }
        AdManager._curAdImp.showAd(cb);
    }

    /** 显示banner */
    public static showBanner(cb?: () => void): void {
        if (!cc.sys.isNative) {
            it.log(`当前平台:${cc.sys.os}，不是原生平台，不能播放banner广告。`);
            if (cb) { cb(); }
            return;
        }
        if (!AdManager._bannerFlag) {
            return;
        }
        if (AdManager._debug) {
            it.log(`debug = ${AdManager._debug}，当前为debug模式`);
            if (cb) { cb(); }
            return;
        }
        if (AdManager._cfg.bannerId === "") {
            it.log(`AdManager._cfg.bannerId = ${AdManager._cfg.bannerId}，不显示banner广告`);
            if (cb) { cb(); }
            return;
        }
        AdManager._curAdImp.showBannerAd(cb);
    }

    /** 设置banner广告播放表示 */
    public static setBannerFlag(flag: boolean): void {
        AdManager._bannerFlag = flag;
    }

    /** 关闭banner广告 */
    public static closeBanner(): void {
        if (cc.sys.isNative) {
            AdManager._curAdImp.closeBannerAd();
        }
    }

    /** 显示插屏广告 */
    public static showSplash(cb?: (s: AdStatus) => void): void {
        if (AdManager._cfg.splashId === "") {
            it.log(`AdManager._cfg.splashId = ${AdManager._cfg.splashId}，不显示开屏广告`);
            return;
        }
        if (cc.sys.isNative) {
            AdManager._curAdImp.showSplashAd(cb);
        }
    }

    // ---------------------------------------------------------------------
    /** 监听原生事件接口 */
    public static adProxyListen(msg: any): void {
        try {
            it.log("native callback: AdManager ");
            it.log("native msg:", msg.status);
            switch (msg.status) {
                case AdReturnStatus.InitSDK:
                    AdManager._curAdImp.initSdkCallBack(msg.param);
                    break;
                case AdReturnStatus.OnError:
                    AdManager._curAdImp.onError(msg);
                    break;
                case AdReturnStatus.OnAdLoaded:
                    AdManager._curAdImp.onAdLoaded(msg);
                    break;
                case AdReturnStatus.OnAdShow:
                    AdManager._curAdImp.onAdShow(msg);
                    // 激励视频开始播放时暂停音效
                    AudioUtil.setPauseFlag(true);
                    break;
                case AdReturnStatus.OnVideoComplete:
                    AdManager._curAdImp.onVideoComplete(msg);
                    break;
                case AdReturnStatus.OnAdClose:
                    AdManager._curAdImp.onAdClose(msg);
                    // 激励视频关闭时打开音效
                    AudioUtil.setPauseFlag(false);
                    break;
                case AdReturnStatus.OnBannerAdError:
                    AdManager._curAdImp.onBannerAdError(msg);
                    break;
                case AdReturnStatus.OnBannerAdLoaded:
                    AdManager._curAdImp.onBannerAdLoaded();
                    break;
                case AdReturnStatus.OnBannerAdShow:
                    let flag = AdManager.checkBannerCanShow();
                    it.log("##banner## flag =", flag, "<--banner是否应该关闭");
                    if (flag) {
                        AdManager._curAdImp.onBannerAdShow();
                    }
                    break;
                case AdReturnStatus.OnBannerAdClose:
                    AdManager._curAdImp.onBannerAdClose(msg);
                    break;
                case AdReturnStatus.OnSplashAdShow:
                    AdManager._curAdImp.onSplashAdShow(msg);
                    break;
                case AdReturnStatus.OnSplashAdSkip:
                    AdManager._curAdImp.onSplashAdSkip(msg);
                    break;
                case AdReturnStatus.OnSplashAdClose:
                    AdManager._curAdImp.onSplashAdClose(msg);
                    break;
            }
        } catch (error) {
            it.log("returnAdClick error:" + error.message);
        }
    }

    /** 检查bannner是否可以展示 */
    private static checkBannerCanShow(): boolean {
        // 如果有popview存在，则判断该顶层view是否需要banner，如不需要则关闭
        let popList = ViewManager.getInstance().popViewList;
        if (popList.length > 0) {
            if ((popList[popList.length - 1].view as GameView).isShowBanner) {
                return true;
            } else {
                setTimeout(() => {
                    it.log(`##banner## - 关闭banner A`);
                    AdManager.closeBanner();
                }, 200);
                return false;
            }
        }
        // 如果没有pop view存在就判断当前场景需不需要banner
        let curScene = ViewManager.getInstance().curScene;
        if (curScene) {
            if ((curScene.view as GameView).isShowBanner) {
                return true;
            }
        }
        setTimeout(() => {
            it.log(`##banner## - 关闭banner B`);
            AdManager.closeBanner();
        }, 200);
        return false;
    }

    /** 根据广告类型获取实现类 */
    private static getImpClsByType(type: AdType): new() => IBaseAd {
        switch (type) {
            case AdType.TT_AD:
                return TTAdImp;
        }
    }

    /** 设置调试模式 */
    public static setDebug(flag: boolean): void {
        AdManager._debug = flag;
    }
}

// 广告回调的状态
export enum AdReturnStatus {
    InitSDK = "InitSDK",
    // -------- 激励视频广告 --------
    OnError = "onError",
    OnAdLoaded = "onAdLoaded",              // 加载成功
    OnAdShow = "onAdShow",
    OnVideoComplete = "onVideoComplete",  // 播放完成
    OnAdClose = "onAdClose",                // 开始播放
    OnAdClick = "onAdClick",              // 点击广告
    OnStimulateSuccess = "onStimulateSuccess", // 播放完毕
    OnVideoPause = "onVideoPause",        // 暂停播放
    OnVideoStart = "onVideoStart",        // 开始播放
    OnAdVideoBarClick = "onAdVideoBarClick", // 点击了下载进度条
    OnVideoError = "onVideoError",      // 播放广告出错
    OnRewardVerify = "onRewardVerify",      // 广告验证奖励触发是否成功
    OnInterAdError = "onInterAdError",      // 
    OnInterAdLoaded = "onInterAdLoaded",
    OnInterAdShow = "onInterAdShow",
    OnInterAdComplete = "onInterAdComplete",
    OnInterAdClose = "onInterAdClose",
    OnInterAdClick = "onAdClick",              // 点击广告
    OnInterAdVideoStart = "onVideoStart",        // 开始播放
    OnInterAdVideoError = "onVideoError",   // 播放广告出错
    // -------- banner广告 --------
    OnBannerAdError = "onBannerAdError",      // 
    OnBannerAdLoaded = "onBannerAdLoaded",
    OnBannerAdShow = "onBannerAdShow",
    OnBannerAdClose = "onBannerAdClose",
    // -------- 插屏广告 --------
    OnSplashAdShow = "onSplashAdShow",      // 插屏广告开始播放
    OnSplashAdSkip = "onSplashAdSkip",      // 跳过插屏广告
    OnSplashAdClose = "onSplashAdClose"     // 插屏广告关闭
}

// 将监听原生事件接口绑定到全局window上
(window as any).AdProxyListen = AdManager.adProxyListen;
