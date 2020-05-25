import BaseCommand from "../../core/mvc/base/BaseCommand";
import CommandManager from "../../core/mvc/manager/CommandManager";
import NotificationManager from "../../core/mvc/manager/NotificationManager";
import BaseModel from "../../core/mvc/base/BaseModel";
import { Facade } from "../../core/mvc/Facade";
import { MVC_struct } from "../../Framework";
import LoadPopViewsCmd from "../command/LoadPopViewsCmd";

/**
 * Base Component用于处理简单逻辑的item UI对象，比如列表的一个item可以继承该类，进行消息分发
 * @author ituuz
 */
export default class GameComponent extends cc.Component {

    /**
     * 发送命令接口
     * @param {{new (): BaseCommand}} cmd 命令类
     * @param {Object} data 命令参数
     */
    public sendCmd<T extends BaseCommand>(cmd: new () => T, data?: any): void {
        CommandManager.getInstance().__executeCommand__(cmd, data);
    }

    /**
     * 发送消息通知
     * @param {string} noti 通知key值
     * @param {Object} body 消息传递的参数
     */
    public sendNoti(noti: string, body?: any): void {
        NotificationManager.getInstance().__sendNotification__(noti, body);
    }

    /**
     * 获取model对象
     * @param {{new (): BaseModel}} model
     */
    public getModel<T extends BaseModel>(model: new () => T): T {
        return Facade.getInstance().getModel(model);
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
