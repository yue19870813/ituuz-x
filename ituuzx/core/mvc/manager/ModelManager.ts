/**
 * 数据模型管理类
 * @author ituuz
 */
import BaseModel from "../base/BaseModel";

export default class ModelManager {
    /** 实例 */
    private static _instance: ModelManager = new ModelManager();

    /** 数据model集合 */
    private _modelList: {};

    /**
     * @constructor
     * @private
     */
    private constructor () {
        this._modelList = {};
    }

    /**
     * 单例获取类
     */
    public static getInstance(): ModelManager {
        return this._instance;
    }

    /**
     * 获取model对象
     * @param {{new (): BaseModel}} model
     */
    public getModel<T extends BaseModel>(model: {new (): T}): T {
        let key = cc.js.getClassName(model);
        return this._modelList[key];
    }

    /**
     * 注册数据model
     * @param {{new (): BaseModel}} model
     */
    public registerModel(model: {new (): BaseModel}): void {
        let key = cc.js.getClassName(model);
        if (this._modelList.hasOwnProperty(key)) {
            console.log(key, "已经存在，不可重复注册！");
        } else {
            let m = new model();
            m.init();
            this._modelList[key] = m;
        }
    }

    /**
     * 移除注册
     * @param {{new (): BaseModel}} model
     */
    public unregisterModel(model: {new (): BaseModel}): void {
        let key = cc.js.getClassName(model);
        if (this._modelList.hasOwnProperty(key)) {
            let m: BaseModel = this._modelList[key];
            m.clear();
            delete this._modelList[key];
        } else {
            console.warn(key, "不存在！");
        }
    }

    /**
     * 释放并移除所有model
     */
    public removeAllModel(): void {
        //  释放并移除所有model
        for (let key in this._modelList) {
            let model: BaseModel = this._modelList[key];
            model.clear();
            delete this._modelList[key];
        }
        this._modelList = {};
    }

}
