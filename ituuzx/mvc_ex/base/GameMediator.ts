import BaseMediator from "../../core/mvc/base/BaseMediator";
import CommandManager from "../../core/mvc/manager/CommandManager";
import LoadLayersCmd from "../command/LoadLayersCmd";
import LoadPopViewsCmd from "../command/LoadPopViewsCmd";
import { MVC_struct } from "../../Framework";

/**
 * BaseMediator的拓展，会处理部分游戏内部公共数据。
 * @author ituuz
 */
export default class GameMediator extends BaseMediator {

    public init(data?: any): void {

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
        CommandManager.getInstance().__executeCommand__(LoadLayersCmd, {mvc: sceneCfg, data: data});
    }

    /**
     * 添加新UI到界面
     * @param viewCfg {MVC_struct} sceneCfg 场景配置
     * @param {any} data 传递给新建UI的参数，自定义类型。
     */
    public addView(viewCfg: MVC_struct, data: any = null): void {
        // 向新建view传递参数
        CommandManager.getInstance().__executeCommand__(LoadPopViewsCmd, {mvc: viewCfg, data: data});
    }

    public destroy(): void {

    }
}