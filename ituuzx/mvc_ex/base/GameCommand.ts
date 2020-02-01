import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { MVC_struct } from "../../Framework";
import LoadPopViewsCmd from "../command/LoadPopViewsCmd";

/**
 * game simple command
 * @author ituuz
 */
export default class GameCommand extends SimpleCommand {

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }

    public execute(body?: any): void {
        throw new Error("Method not implemented.");
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
}
