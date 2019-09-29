/**
 * 消息管理类
 * @author ituuz
 */
import {ViewManager} from "./ViewManager";
import BaseMediator from "../base/BaseMediator";

export default class NotificationManager {

    // 实例
    private static _instance: NotificationManager = new NotificationManager();

    /**
     * @constructor
     * @private
     */
    private constructor () {

    }

    /**
     * 单例获取类
     */
    public static getInstance(): NotificationManager {
        return this._instance;
    }

    /**
     * 发送消息通知, 框架使用，外部不得调用。
     * @param {string} noti 通知key值
     * @param {Object} body 消息传递的参数
     * @private
     */
    public __sendNotification__(noti: string, body?: any): void {
        // pop view
        let popViewList: BaseMediator[] = ViewManager.getInstance().popViewList;
        this.loopMap(popViewList, noti, body);
        // add layer view
        let layerViewList: BaseMediator[] = ViewManager.getInstance().layerViewList;
        this.loopMap(layerViewList, noti, body);
        // scene
        let curScene: BaseMediator = ViewManager.getInstance().curScene;
        this.loopMap([curScene], noti, body);
    }

    /**
     * 循环遍历map检索通知对象
     * @param {BaseMediator[]} list view mediator list
     * @param {string} noti 消息名称
     * @param {Object} body 消息传递的参数
     */
    private loopMap(list: BaseMediator[], noti: string, body?: any): void {
        for (let med of list) {
            let notiMap: Map<string, {key: string, cb: (data: any)=>void, target: any}> = med["_notiMap"];
            notiMap.forEach((value: {key: string, cb: (data: any)=>void, target: any}, key: string)=>{
                if (key === noti) {
                    value.cb.call(value.target, body);
                }
            }, this);
        }
    }
}
