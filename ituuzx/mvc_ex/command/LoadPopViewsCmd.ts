import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { Facade } from "../../core/mvc/Facade";
import JSUtil from "../../core/util/JSUtil";
import { MVC_struct } from "../../Framework";
import GameView from "../base/GameView";
import PopViewManager from "../manager/PopViewManager";

/**
 * 根据配置加载场景或者view的命令。
 * @author ituuz
 */
export default class LoadPopViewsCmd extends SimpleCommand {
    /** 是否是在弹出view过程 */
    public static IN_POP_VIEW_STATUS: boolean = false;

    public execute(body?: any): void {
        // if (LoadPopViewsCmd.IN_POP_VIEW_STATUS) {
        //     return;
        // }
        LoadPopViewsCmd.IN_POP_VIEW_STATUS = true;
        // 增加参数传递逻辑
        this.loadViews([body.mvc], body.data, body.parent, body.useCache);
    }

    /**
     * 根据配置数据加载view逻辑
     * @param {MVC_struct[]} views view配置
     * @param {any} data 自定义透传参数 可选
     * @param {cc.Node} parent 父节点 可选
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    private loadViews(views: MVC_struct[], data: any = null, parent: cc.Node = null,
                      useCache: boolean = false): void {
        if (views && views.length > 0) {
            // 遍历节点数组创建layer
            for (let mvcObj of views) {
                let viewModule = null;
                JSUtil.importCls(mvcObj.viewClass).then((module) => {
                    viewModule = module;
                    return JSUtil.importCls(mvcObj.medClass);
                }).then((medModule) => {
                    Facade.getInstance().popView(medModule, viewModule, mvcObj.medClass, data, (view: GameView) => {
                        if (parent) { view.node.parent = parent; }
                        // 加载完成后的回调,递归加载childern
                        if (mvcObj.children && mvcObj.children.length > 0) {
                            this.loadViews(mvcObj.children, null);
                        } else {
                            LoadPopViewsCmd.IN_POP_VIEW_STATUS = false;
                        }
                    }, useCache);
                });
            }
        } else {
            LoadPopViewsCmd.IN_POP_VIEW_STATUS = false;
        }
        let option = body.option;
        let immediate = false;
        if (option) {
            immediate = option.immediate;
        }
        if (immediate) {
            // 立即弹出界面，没有时间间隔
            PopViewManager.popViewImmediate([body.mvc], body.data, body.parent, body.useCache);
        } else {
            // 调用弹出view, 此接口同时只支持弹出一个界面，有500毫秒间隔
            PopViewManager.popView([body.mvc], body.data, body.parent, body.useCache);
        }
    }

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }
}
