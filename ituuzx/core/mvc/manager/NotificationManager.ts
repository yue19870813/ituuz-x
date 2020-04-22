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
    private constructor() {

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
    public __sendNotification__(noti: string | number, body?: any): void {
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
    private loopMap(list: BaseMediator[], noti: string | number, body?: any): void {
        // 待优化，根据UI注册和反注册逻辑，暂时没有
        for (let med of list) {
            if (med == null || med === undefined) {
                continue;
            }
            try {
                // tslint:disable-next-line: no-string-literal
                let notiMap: Map<string | number, {key: string| number, cb: (data: any) => void, target: any}> = med["_notiMap"];
                let notiObj = notiMap.get(noti);
                if (notiObj) {
                    notiObj.cb.call(notiObj.target, body);
                }
            } catch (e) {
                it.error(e);
            }
        }
    }
}
