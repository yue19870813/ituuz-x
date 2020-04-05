import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { Facade } from "../../core/mvc/Facade";
import JSUtil from "../../core/util/JSUtil";
import { MVC_struct } from "../../Framework";
import GameView from "../base/GameView";

/**
 * 添加layer层级item, 需要注意的是，这个item是单个的，并且不支持嵌套
 * @author ituuz
 */
export default class AddLayerItemCmd extends SimpleCommand {

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }

    public execute(body?: any): void {
        // 加载完场景开始加载view
        this.loadViews(body.mvc, body.data, body.parent, body.zOrder);
    }

    /** 根据配置数据加载view */
    private loadViews(mvcObj: MVC_struct, data: any,  parentNode: cc.Node, zOrder: number = 0): void {
        if (mvcObj) {
            let viewModule = null;
            JSUtil.importCls(mvcObj.viewClass).then((module) => {
                viewModule = module;
                return JSUtil.importCls(mvcObj.medClass);
            }).then((medModule) => {
                Facade.getInstance().addLayer(medModule, viewModule, mvcObj.medClass, zOrder, data, (view: GameView) => {
                    if (mvcObj.showBanner) {
                        view.isShowBanner = true;
                    }
                }, parentNode);
            });
        }
    }
}
