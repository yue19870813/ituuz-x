import BaseCommand from "../../core/mvc/base/BaseCommand";
import CommandManager from "../../core/mvc/manager/CommandManager";
import NotificationManager from "../../core/mvc/manager/NotificationManager";
import BaseModel from "../../core/mvc/base/BaseModel";
import { Facade } from "../../core/mvc/Facade";

export default class GameComponent extends cc.Component {

    /**
     * 发送命令接口
     * @param {{new (): BaseCommand}} cmd 命令类
     * @param {Object} data 命令参数
     */
    public sendCmd<T extends BaseCommand>(cmd: {new (): T}, data?: any): void {
        CommandManager.getInstance().__executeCommand__(cmd, data);
    }

    /**
     * 发送消息通知
     * @param {string} noti 通知key值
     * @param {Object} body 消息传递的参数
     */
    public sendNoti(noti: string, body: any): void {
        NotificationManager.getInstance().__sendNotification__(noti, body);
    }

    /**
     * 获取model对象
     * @param {{new (): BaseModel}} model
     */
    public getModel<T extends BaseModel>(model: {new (): T}): T {
        return Facade.getInstance().getModel(model);
    }
}