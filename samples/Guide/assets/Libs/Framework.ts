import AtlasManager from "./core/load/atlas/AtlasManager";
import BaseModel from "./core/mvc/base/BaseModel";
import { Facade } from "./core/mvc/Facade";
import CommandManager from "./core/mvc/manager/CommandManager";
import ModelManager from "./core/mvc/manager/ModelManager";
import { ViewManager } from "./core/mvc/manager/ViewManager";
import AudioUtil from "./core/util/AudioUtil";
import FrameworkCfg from "./FrameworkCfg";
import LoadLayersCmd from "./mvc_ex/command/LoadLayersCmd";
import { StatsData } from "./sdk/stats/StatsManager";
import { NetHelper } from "./extension/net/NetHelper";

/**
 * 框架煮类，用户初始化框架以及提供一些框架级别的接口。
 * @author ituuz
 */
export default class Framework {

    /**
     * 初始化框架接口
     * @param {MVC_struct | MVC_scene} scene 初始化游戏的第一个场景
     * @param {boolean} debug 框架是否是调试模式
     * @param {cc.Size} designResolution 默认的设计分辨率
     * @param {boolean} fitWidth 是否宽适配
     * @param {boolean} fitHeight 是否高适配
     */
    public static start(
            scene: MVC_struct | MVC_scene,
            models: {new (): BaseModel}[],
            debug: boolean = true, 
            designResolution: cc.Size = cc.size(960, 640), 
            fitWidth: boolean = false, 
            fitHeight: boolean = false
        ): void {
        Facade.getInstance().init(debug, designResolution, fitWidth, fitHeight);
        Framework.registerModels(models);
        // 运行第一个场景
        CommandManager.getInstance().__executeCommand__(LoadLayersCmd, {mvc: scene, data: null});
        // 监听游戏从后台激活
        cc.game.on(cc.game.EVENT_SHOW, () => {
            it.log("== Framework cc.game.EVENT_SHOW ==");
            ViewManager.getInstance().showOrHide("show");
            AudioUtil.setPauseFlag(false);
        });
        // 监听游戏进入后台
        cc.game.on(cc.game.EVENT_HIDE, () => {
            it.log("== Framework cc.game.EVENT_HIDE ==");
            ViewManager.getInstance().showOrHide("hide");
            AudioUtil.setPauseFlag(true);
        });
    }

    /**
     * 注册数据model
     * @param {{new (): BaseModel}} model
     */
    private static registerModels(models: {new (): BaseModel}[]): void {
        for (let model of models) {
            Facade.getInstance().registerModel(model);
        }
    }

    /**
     * 获取model对象
     * @param {{new (): BaseModel}} model
     */
    public static getModel<T extends BaseModel>(model: {new (): T}): T {
        return Facade.getInstance().getModel(model);
    }

    /** 设置banner广告播放时记录的日志内容 */
    public static setBannerStatsData(stats: StatsData): void {
        FrameworkCfg.BANNER_STATS_DATA = stats;
    }

    /** 重启游戏接口 */
    public static restartGame(): void {
        ViewManager.getInstance().destroy();
        ModelManager.getInstance().removeAllModel();
        AtlasManager.destroy();
        NetHelper.removeAllRS();
        AudioUtil.stopMusic();
        cc.director.pause();
        setTimeout(() => {
            cc.director.resume();
            cc.game.restart();
        }, 1000);
    }
}

/** 一个者UI层的配置结构 */
export class MVC_struct {
    public viewClass: string;
    public medClass: string;
    public children: MVC_struct[];
    public showBanner?: boolean;
}

/** 一个场景配置结构对象 */
export class MVC_scene {
    public viewClass: string;
    public medClass: string;
    public children: MVC_struct[];
    public model?: string[];
    public showLoading?: boolean;
    public showBanner?: boolean;
}

// 将接口导出
(<any>window).it || ((<any>window).it = {});
(<any>window).it.Framework = Framework;

