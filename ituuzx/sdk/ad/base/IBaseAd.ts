import { AdConfigItem } from "./AdConfigItem";
import { AdStatus } from "../AdManager";

/**
 * {interface} 广告播放接口
 * @author ituuz
 */
export interface IBaseAd {
    // ========================= 激励视频 =========================== //
    // 加载中
    loading: boolean;
    // 播放中
    playing: boolean;
    // 可以播放广告
    isReady: boolean;
    // 是否自动播放
    autoShow: boolean;
    // 是否初始化了sdk
    initSdk: boolean;
    // 失败次数
    loadFailNumber: number;
    // ========================= 激励视频 =========================== //
    // ========================= banner广告 =========================== //
    showBannerAdCB: () => void;
    // 加载中
    bannerLoading: boolean;
    // 播放中
    bannerPlaying: boolean;
    // 可以播放广告
    bannerIsReady: boolean;
    // 是否自动播放
    bannerAutoShow: boolean;
    // ========================= banner广告 =========================== //

    // 初始化sdk
    initAdSdk(ad: AdConfigItem, cb: () => void): void;

    // ========================= 激励视频 =========================== //
    // 加载
    loadAd(adVideoId?: string, userId?: string): void;
    // 播放
    showAd(cbFunc?: (status: AdStatus) => void): void;
    // 初始化sdk返回
    initSdkCallBack(status: string): void;
    // 广告拉取异常
    onError(msg?: any): void;
    // 广告加载成功
    onAdLoaded(msg: any): void;
    // 广告正在播放
    onAdShow(msg?: any): void;
    // 广告界面关闭
    onAdClose(msg?: any, cb?: () => {}): void;
    // 广告视频请求完成
    onVideoComplete(msg?: any): void;
    // ========================= 激励视频 =========================== //

    // ========================= banner广告 =========================== //
    // 显示banner广告
    showBannerAd(cb?: () => void): void;
    // 加载banner广告
    loadBannerAd(): void;
    // 关闭banner广告
    closeBannerAd(cb?: () => void): void;
    // 广告拉取异常
    onBannerAdError(msg?: any): void;
    // 广告加载成功
    onBannerAdLoaded(msg?: any): void;
    // 广告正在播放
    onBannerAdShow(msg?: any): void;
    // 广告界面关闭
    onBannerAdClose(msg?: any, cb?: () => void): void;
    // ========================= banner广告 =========================== //

    // ========================= 开屏广告 =========================== //
    // 加载插屏广告
    showSplashAd(cb: (s: AdStatus) => void, splashAdId?: string): void;
    // 插屏广告开始播放
    onSplashAdShow(msg?: any): void;
    // 跳过插屏广告
    onSplashAdSkip(msg?: any): void;
    // 插屏广告关闭
    onSplashAdClose(msg?: any): void;
    // ========================= 开屏广告 =========================== //
}
