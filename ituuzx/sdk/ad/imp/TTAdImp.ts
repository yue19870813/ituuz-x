/**
 * 头条广告实现类
 * @author ituuz
 * @description 目前包括激励视频广告、banner广告
 */
import { AdStatus } from "../AdManager";
import { AdConfigItem } from "../base/AdConfigItem";
import { IBaseAd } from "../base/IBaseAd";

export default class TTAdImp implements IBaseAd {
    // 当前用户唯一标识符
    public userId: string = "default";
    // 广告配置对象
    public ad: AdConfigItem;
    // 广告初始化成功回调
    public adInitCallback: () => void;
    // ========================= 激励视频 =========================== //
    public loading: boolean = false;
    public playing: boolean = false;
    public isReady: boolean = false;
    public autoShow: boolean = false;
    public initSdk: boolean = false;
    public loadFailNumber: number = 0;
    // 激励视频播放完成回调
    public showAdCallback: (status: AdStatus) => void;
    // ========================= 激励视频 =========================== //

    // ========================= banner广告 =========================== //
    public showBannerAdCB: () => void;
    public bannerLoading: boolean = false;
    public bannerPlaying: boolean = false;
    public bannerIsReady: boolean = false;
    public bannerAutoShow: boolean = false;
    // banner广告放打开回调
    public showBannerCallback: (status: AdStatus) => void;
    // ========================= banner广告 =========================== //

    // ========================= 插屏广告 =========================== //
    public showSplashCallback: (status: AdStatus) => void;
    // ========================= 插屏广告 =========================== //

    /**
     * 初始化广告sdk
     * @param {string} appId 应用id
     * @param {string} advId 广告位id
     */
    public initAdSdk(ad: AdConfigItem, cb: () => void): void {
        this.ad = ad;
        this.adInitCallback = cb;
        it.log("AdManager====aaa=====initAdSdk==appId = " + this.ad.appId, ", advId = ", this.ad.advId);
        if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
            it.log(`TTAdImp byteDanceAdAppid = ${this.ad.appId}, advId = ${this.ad.advId}`);
            let byteDanceAdAppName = ad.name;
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager",
                "initTTAdSDK", "(Ljava/lang/String;Ljava/lang/String;)V",
                this.ad.appId, byteDanceAdAppName);
            it.log("TTAdImp InitAdSdk");
        } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
            it.log(`TTAdImp byteDanceAdAppid = ${this.ad.appId}, advId = ${this.ad.advId}`);
            jsb.reflection.callStaticMethod("TTAdManager", "initSDK:", this.ad.appId);
            it.log("TTAdImp InitAdSdk");
        }
    }

    /**
     * 初始化sdk回调
     * @param {string} status 回调返回状态信息 
     */
    public initSdkCallBack(status: string): void {
        it.log(`TTAdImp -> InitSdkCallBack:status= ${status}`);
        if (status === "0") {
            this.initSdk = false;
            it.log(`TTAdImp -> InitSdkCallBack:this.initSdk= ${this.initSdk}`);
        } else if (status === "1") {
            this.initSdk = true;
            if (this.adInitCallback) {
                this.adInitCallback();
            }
            it.log(`TTAdImp -> InitSdkCallBack:this.initSdk= ${this.initSdk}`);
            // 预加载激励视频
            // this.loadAd(this.ad.advId);
            // 预加载banner广告
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
                this.loadBannerAd();
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
                this.loadBannerAd();
            }
            // 预加载插屏广告
            // this.loadInterstitialAd();
        }
    }

    // ========================= 激励视频 =========================== //
    /**
     * 加载激励视频广告
     * @param {string} adVideoId 激励视频广告位id
     * @param {string} userId 用户唯一标志符
     */
    public loadAd(adVideoId?: string, userId?: string): void {
        if (!adVideoId) {
            adVideoId = this.ad.advId;
        }
        if (userId) {
            this.userId = userId;
        }

        if (this.loading === true || this.playing === true || this.isReady === true) {
            it.warn("广告状态 loading:" + this.loading + ",showing:" + this.playing + ",isReady:" + this.isReady);
            return;
        }
        this.loading = true;
        if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager",
                "loadAd", "(Ljava/lang/String;Ljava/lang/String;)V", adVideoId, this.userId);
        } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("TTAdManager", "loadAd:ttVid:", this.userId, adVideoId);
        }
    }

    // 广告加载成功回调
    public onAdLoaded(msg: any): void {
        this.loading = false;
        this.isReady = true;
        this.loadFailNumber = 0;
        it.log(`TTAdImp -> OnAdLoaded: prepare show Ad`);
        if (this.autoShow) {
            this.showAd();
        }
    }

    // 播放广告
    public showAd(cb?: (status: AdStatus) => void): void {
        // if (this.playing) {
        //     it.log("TTAdImp->ShowAd:this.playing is true.");
        //     return;
        // }
        if (cb) {
            this.showAdCallback = cb;
        }
        if (this.isReady === true) {
            it.log("TTAdImp->ShowAd:this.isReady ok");
            // 播放激励视频广告
            // this.playing = true;
            this.isReady = false;
            this.autoShow = false;
            // 调用native接口播放广告
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager", "showAd", "()V");
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("TTAdManager", "showAd", "");
            }
            return;
        }
        this.autoShow = true;
        this.loadAd();
    }

    public onError(msg?: any): void {
        it.log("广告拉取失败");
        this.playing = false;
        this.loading = false;
        this.isReady = false;
        this.loadFailNumber++;
        if (this.loadFailNumber < 10) {
            this.loadAd();
            return;
        }
        this.loadFailNumber = 0;
        if (this.showAdCallback) {
            this.showAdCallback(AdStatus.PLAY_FAIL);
        }
    }

    public onAdShow(msg?: any): void {
        it.log("广告开始播放中");
        if (this.showAdCallback) {
            this.showAdCallback(AdStatus.PLAY_START);
        }
    }

    public onAdClose(msg?: any, cb?: () => {}): void {
        it.log("TTAdImp === 广告关闭");
        it.log(this.showAdCallback);
        this.playing = false;
        if (this.showAdCallback) {
            // 穿山甲广告总会出现播放完成没有回调的情况，所以这里将广告关闭作为播放完成状态
            this.showAdCallback(AdStatus.PLAY_SUCC);
        }
        this.loadAd();
    }

    public onVideoComplete(msg?: any): void {
        it.log("TTAdImp === 广告播放完成");
        this.playing = false;
        if (this.showAdCallback) {
            // this.showAdCallback(AdStatus.PLAY_SUCC);
        }
        this.loadAd();
    }
    // ========================= 激励视频 =========================== //

    // ================= banner 广告 =======================
    /** 加载banner广告 */
    public loadBannerAd(): void {
        it.log("Banner Ad: TTAdImp ==== banner广告 LoadBannerAd");
        it.log("bannerLoading:", this.bannerLoading, ",showing:", this.bannerPlaying,
            ",isReady:", this.bannerIsReady, ",initSdk:", this.initSdk);
        if (this.bannerLoading === false && this.bannerPlaying === false && this.bannerIsReady === false && this.initSdk) {
            this.bannerLoading = true;
            it.log("TTAdImp ===  bannerAd:" + this.ad.bannerId);
            if (this.ad.bannerId !== "") {
                this.bannerLoading = true;
                if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager",
                        "loadBannerAd", "(Ljava/lang/String;)V", this.ad.bannerId);
                } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
                    jsb.reflection.callStaticMethod("TTAdManager", "loadBannerAd:bannerId:", "userid", this.ad.bannerId);
                }
            }
        }
    }

    /** banner广告加载成功 */
    public onBannerAdLoaded(msg: any): void {
        it.log("Banner Ad: banner广告 OnBannerAdLoaded");
        this.bannerLoading = false;
        this.bannerIsReady = true;
        if (this.bannerAutoShow) {
            this.showBannerAd();
        }
    }

    /** 显示banner广告 */
    public showBannerAd(cb?: () => void): void {
        if (this.bannerIsReady) {
            it.log("Banner Ad: showBannerAd is ready!!!");
            this.showBannerCallback = cb;
            this.bannerPlaying = true;
            this.bannerIsReady = false;
            this.bannerAutoShow = false;
            it.log("Banner Ad: TTAdImp " + "showBannerAd");
            if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager", "showBannerAd", "()V");
            } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("TTAdManager", "showBannerAd", "");
            }
        } else {
            it.log("Banner Ad: showBannerAd is not ready, should loadBanner");
            this.bannerAutoShow = true;
            this.loadBannerAd();
        }
    }

    public closeBannerAd(cb?: () => void): void {
        it.log("Banner Ad: TTAdImp == Method closeBannerAd.");
        it.log("Banner Ad: TTAdImp == CloseBannerAd");
        this.bannerPlaying = false;
        this.bannerIsReady = false;
        if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager", "closeBannerAd", "()V");
        } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("TTAdManager", "closeBannerAd", "");
        }
    }

    public onBannerAdError(msg?: any): void {
        it.log("Banner Ad: === onBannerAdError ===");
        this.bannerPlaying = false;
        this.bannerLoading = false;
        // this.loadBannerAd();
    }

    public onBannerAdShow(msg?: any): void {
        it.log("Banner Ad: === onBannerAdShow ===");
        if (this.showBannerCallback) {
            this.showBannerCallback(AdStatus.PLAY_SUCC);
            this.showBannerCallback = null;
        }
    }

    public onBannerAdClose(msg?: any, cb?: () => void): void {
        it.log("Banner Ad: TTAdImp == banner广告 OnBannerAdClose");
        this.bannerPlaying = false;
        this.bannerIsReady = false;
        this.loadBannerAd();
    }
    // ================= banner 广告 =======================

    // ================= 开屏广告 广告 =======================
    public showSplashAd(cb: (s: AdStatus) => void, splashAdId?: string): void {
        it.log("[Splash ad]: TTAdImp == showSplashAd");
        if (!splashAdId) {
            splashAdId = this.ad.splashId;
        }
        if (!splashAdId || splashAdId === "") {
            it.warn("[Splash ad]没有配置开屏广告");
            return;
        }
        this.showSplashCallback = cb;
        if (cc.sys.OS_ANDROID === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ad/ByteDanceAdManager", "loadSplashAd", "(Ljava/lang/String;)V", splashAdId);
        } else if (cc.sys.OS_IOS === cc.sys.os && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("TTAdManager", "loadSplashAd:splashId:", "userid", splashAdId);
        }
    }

    public onSplashAdShow(msg?: any): void {
        it.log("Splash Ad: === onSplashAdShow ===", msg);
        if (this.showSplashCallback) {
            this.showSplashCallback(AdStatus.PLAY_START);
        }
    }
    public onSplashAdSkip(msg?: any): void {
        it.log("Splash Ad: === onSplashAdSkip ===", msg);
        if (this.showSplashCallback) {
            this.showSplashCallback(AdStatus.PLAY_SKIP);
            this.showSplashCallback = null;
        }
    }
    public onSplashAdClose(msg?: any): void {
        it.log("Splash Ad: === onSplashAdClose ===", msg);
        if (this.showSplashCallback) {
            this.showSplashCallback(AdStatus.PLAY_CLOSE);
            this.showSplashCallback = null;
        }
    }
}
