import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { Facade } from "../../core/mvc/Facade";
import NotificationManager from "../../core/mvc/manager/NotificationManager";
import JSUtil from "../../core/util/JSUtil";
import { MVC_scene, MVC_struct } from "../../Framework";
import { AdManager } from "../../sdk/ad/AdManager";
import GameMediator from "../base/GameMediator";
import GameScene from "../base/GameScene";
import GameView from "../base/GameView";
import { LoadingManager } from "../manager/LoadingManager";

/**
 * 根据配置加载场景或者view的命令。
 * @author ituuz
 */
export default class LoadLayersCmd extends SimpleCommand {

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }

    public execute(body?: any): void {
        let mvc = body.mvc;
        let data = body.data;
        // 加载完场景开始加载view
        let loadViewChildren = (isRoot: boolean = true) => {
            if (!isRoot) {
                this.loadViews([mvc]);
            } else {
                this.loadViews(mvc.children, mvc.medClass);
            }
        };

        let viewModule = null;
        // 根据配置文件开始加载
        JSUtil.importCls(mvc.viewClass).then((module) => {
            viewModule = module;
            return JSUtil.importCls(mvc.medClass);
        }).then((medModule) => {
            if (JSUtil.isChildClassOf(viewModule, GameScene)) {
                let mediator = Facade.getInstance().runScene(medModule,
                    viewModule, data, (med: GameMediator) => {
                        loadViewChildren(true);
                        if ((mvc as MVC_scene).showBanner) {
                            med.view.isShowBanner = true;
                            // 打开banner广告
                            AdManager.showBanner(() => {
                                it.log(`##banner## - 场景${mvc.viewClass}打开banner`);
                                // 记录banner广告日志
                                NotificationManager.getInstance().__sendNotification__("__OPEN_BANNER_NOTI__", mvc.viewClass);
                            });
                        }
                    }
                ) as GameMediator;
                // 开始显示loading
                if ((mvc as MVC_scene).showLoading) {
                    let loadingView = LoadingManager.show();
                    mediator.onLoadingShow(loadingView);
                }
            } else {
                loadViewChildren(false);
            }
        });
    }

    /** 根据配置数据加载view */
    private loadViews(views: MVC_struct[], parent: string = "", isRoot: boolean = false): void {
        if (views && views.length > 0) {
            // 获取父节点
            let parentNode: cc.Node = null;
            if (isRoot) {
                let scene = Facade.getInstance().getCurScene();
                parentNode = scene.view.node;
            } else {
                let layerList = Facade.getInstance().getLayerList();
                for (let layer of layerList) {
                    // tslint:disable-next-line: no-string-literal
                    let layerName = layer.medName;
                    if (layerName === parent) {
                        parentNode = layer.view.node;
                        break;
                    }
                }
            }
            // 遍历节点数组创建layer
            for (let i = 0; i < views.length; i++) {
                let mvcObj = views[i];
                let viewModule = null;
                JSUtil.importCls(mvcObj.viewClass).then((module) => {
                    viewModule = module;
                    return JSUtil.importCls(mvcObj.medClass);
                }).then((medModule) => {
                    Facade.getInstance().addLayer(medModule, viewModule, mvcObj.medClass, i, null, (view: GameView) => {
                        if (mvcObj.showBanner) {
                            view.isShowBanner = true;
                        }
                        // 加载完成后的回调,递归加载childern
                        if (mvcObj.children && mvcObj.children.length > 0) {
                            this.loadViews(mvcObj.children, mvcObj.medClass, false);
                        }
                    }, parentNode);
                });
            }
        }
    }
}
