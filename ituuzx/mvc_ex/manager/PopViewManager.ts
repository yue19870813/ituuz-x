import { Facade } from "../../core/mvc/Facade";
import NotificationManager from "../../core/mvc/manager/NotificationManager";
import { ViewManager } from "../../core/mvc/manager/ViewManager";
import JSUtil from "../../core/util/JSUtil";
import { MVC_struct } from "../../Framework";
import { AdManager } from "../../sdk/ad/AdManager";
import GameView from "../base/GameView";

/** 弹出界面数据对象 */
class PopViewData {
    public views: MVC_struct[];
    public data: any;
    public parent: cc.Node;
    public useCache: boolean;
}

/**
 * 弹出界面管理器
 * @author ituuz
 * @description 负责处理弹出界面的加载和创建，以及队列状态维护 
 */
export default class PopViewManager {
    // TODO 弹出界面队列
    // tslint:disable-next-line: variable-name
    private static __viewQueue__: PopViewData[] = [];
    // 上次打开界面时间，用于解决连点问题
    // tslint:disable-next-line: variable-name
    private static __lastTime__: number = 0;

    /**
     * 加载view逻辑
     * @param {MVC_struct[]} views view配置
     * @param {any} data 自定义透传参数 可选
     * @param {cc.Node} parent 父节点 可选
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    public static popView(views: MVC_struct[], data: any = null, parent: cc.Node = null, useCache: boolean = false): void {
        let curTime = new Date().getTime();
        let temp = curTime - PopViewManager.__lastTime__;
        if (temp > 500 || temp < 0) {
            // TODO：进行队列管理
            PopViewManager.__loadViews__(views, data, parent, useCache);
            PopViewManager.__lastTime__ = curTime;
        }
    }

    /**
     * 加载view逻辑
     * @param {MVC_struct[]} views view配置
     * @param {any} data 自定义透传参数 可选
     * @param {cc.Node} parent 父节点 可选
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    public static popViewImmediate(views: MVC_struct[], data: any = null, parent: cc.Node = null, useCache: boolean = false): void {
        PopViewManager.__loadViews__(views, data, parent, useCache);
    }

    /**
     * 递归加载view逻辑
     * @param {MVC_struct[]} views view配置
     * @param {any} data 自定义透传参数 可选
     * @param {cc.Node} parent 父节点 可选
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    private static __loadViews__(views: MVC_struct[], data: any = null, parent: cc.Node = null, useCache: boolean = false): void {
        if (!views || views.length <= 0) {
            return;
        }
        // 遍历节点数组创建layer
        for (let mvcObj of views) {
            let viewModule = null;
            JSUtil.importCls(mvcObj.viewClass).then((module) => {
                viewModule = module;
                return JSUtil.importCls(mvcObj.medClass);
            }).then((medModule) => {
                Facade.getInstance().popView(medModule, viewModule, mvcObj.medClass, data, (view: GameView) => {
                    if (parent) { view.node.parent = parent; }
                    if (mvcObj.showBanner) {
                        view.isShowBanner = true;
                        if (PopViewManager.isBannerPlaying()) {
                            it.log("Banner Ad: banner已经打开了");
                        } else {
                            // 打开banner广告
                            it.log(`Banner Ad: [${mvcObj.medClass}] open start.`);
                            AdManager.showBanner(() => {
                                it.log(`Banner Ad: [${mvcObj.medClass}] open finished.`);
                                // 记录banner广告日志
                                NotificationManager.getInstance().__sendNotification__("__OPEN_BANNER_NOTI__", mvcObj.medClass);
                            });
                        }
                    } else {
                        it.log(`Banner Ad: [${mvcObj.viewClass}] banner closed.`);
                        AdManager.closeBanner();
                    }
                    // 加载完成后的回调,递归加载childern
                    if (mvcObj.children && mvcObj.children.length > 0) {
                        PopViewManager.__loadViews__(mvcObj.children, null);
                    }
                }, useCache);
            });
        }
    }

    /** 判断当前banner是否播放中 */
    public static isBannerPlaying(): boolean {
        let popList = ViewManager.getInstance().popViewList;
        if (popList.length > 0) {
            if ((popList[popList.length - 1].view as GameView).isShowBanner) {
                return true;
            }
        }
        let curScene = ViewManager.getInstance().curScene;
        if (curScene && curScene.view) {
            if ((curScene.view as GameView).isShowBanner) {
                return true;
            }
        }
        return false;
    }
}
