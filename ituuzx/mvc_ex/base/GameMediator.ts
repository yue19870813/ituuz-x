/**
 * BaseMediator的拓展，会处理部分游戏内部公共数据。
 * @author ituuz
 */

import BaseMediator from "../../core/mvc/base/BaseMediator";
import { MVC_scene, MVC_struct } from "../../Framework";
import LoadLayersCmd from "../command/LoadLayersCmd";
import LoadPopViewsCmd from "../command/LoadPopViewsCmd";
import { MiLoadingView } from "../manager/LoadingManager";
import GameView from "./GameView";

export default class GameMediator extends BaseMediator {

    public view: GameView;

    public init(data?: any): void {

    }

    public customInit(): void {
    }

    /** 视图创建完成显示时会调用的接口 */
    public viewDidAppear(): void {
    }

    /** 从底层显示到最上层时调用 */
    public __onAppear__(): void {
        super.__onAppear__();
    }
    public onAppear(): void {
    }

    /** 从最上层被其他View遮挡变成下层时调用 */
    public __onDisappear__(): void {
        super.__onDisappear__();
        this.view.__closeBanner__();
    }
    public onDisappear(): void {
    }

    /** @override loading界面打开时被调用 */
    public onLoadingShow(loadingView: MiLoadingView): void {

    }
    /** @override 当前loading界面被关闭时调用 */
    public onLoadingClosed(): void {
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
     * @param {MVC_struct | MVC_scene} sceneCfg 场景配置
     * @param {any} data 传递给下个场景的参数，自定义类型。
     */
    public gotoScene(sceneCfg: MVC_struct | MVC_scene, data: any = null): void {
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

    /**
     * // TODO 添加子对象,允许MVC节点持有新的MVC子节点，并当父类MVC销毁时，同时销毁MVC子节点
     * // TODO MVC对象增加uuid，用于区别和手动设置uuid来自定义复用和刷新逻辑
     * @param viewCfg {MVC_struct} sceneCfg 场景配置
     * @param {any} data 传递给新建UI的参数，自定义类型。
     * @param {cc.Node} parent 父节点对象，可选 
     */
    public addItem(viewCfg: MVC_struct, data?: any, parent?: cc.Node): void {
        if (!parent) {
            parent = this.view.node;
        }
        // 向新建view传递参数
        // this.sendCmd(LoadPopViewsCmd, {mvc: viewCfg, data, parent, useCache: false});
        throw Error("not implements.");
    }

    public destroy(): void {

    }
}
