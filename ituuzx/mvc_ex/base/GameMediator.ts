/**
 * BaseMediator的拓展，会处理部分游戏内部公共数据。
 * @author ituuz
 */

import BaseMediator from "../../core/mvc/base/BaseMediator";
import { MVC_struct } from "../../Framework";
import LoadLayersCmd from "../command/LoadLayersCmd";
import LoadPopViewsCmd from "../command/LoadPopViewsCmd";

export default class GameMediator extends BaseMediator {

    public init(data?: any): void {

    }

    public customInit(): void {
    }

    public viewDidAppear(): void {

    }

    /**
     * @deprecated 不建议使用
     */
    public runScene() {
        throw Error("Please use 'gotoScene()' instead of 'runScene()'.");
    }

    /**
     * @deprecated 不建议使用
     */
    public popView(): void {
        throw Error("Please use 'addView()' instead of 'popView()'.");
    }

    /**
     * 跳转场景
     * @param {MVC_struct} sceneCfg 场景配置
     * @param {any} data 传递给下个场景的参数，自定义类型。
     */
    public gotoScene(sceneCfg: MVC_struct, data: any = null): void {
        // 向新建scene传递参数
        this.sendCmd(LoadLayersCmd, {mvc: sceneCfg, data});
    }

    /**
     * 添加新UI到界面
     * @param viewCfg {MVC_struct} sceneCfg 场景配置
     * @param {any} data 传递给新建UI的参数，自定义类型。
     * @param {cc.Node} parent 父节点对象，可选
     * @param {boolean} useCache 是否使用已经存在的缓存View，可选，默认不使用false。
     */
    public addView(viewCfg: MVC_struct, data?: any, parent?: cc.Node, useCache?: boolean): void {
        // 向新建view传递参数
        this.sendCmd(LoadPopViewsCmd, {mvc: viewCfg, data, parent, useCache});
    }

    public destroy(): void {

    }
}
