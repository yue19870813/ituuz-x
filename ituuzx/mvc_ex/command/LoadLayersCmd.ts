import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { Facade } from "../../core/mvc/Facade";
import JSUtil from "../../core/util/JSUtil";
import GameScene from "../base/GameScene";
import { MVC_struct } from "../../Framework";

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
                Facade.getInstance().runScene(medModule,
                    viewModule, data, loadViewChildren.bind(this));
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
                    let layerName = layer["__proto__"]["constructor"]["name"];
                    if (layerName == parent) {
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
                    Facade.getInstance().addLayer(medModule, viewModule, i, null, () => {
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
