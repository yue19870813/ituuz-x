/**
 * 数据模型管理类
 * @author ituuz
 */
import BaseModel from "../base/BaseModel";

export default class ModelManager {
    /** 实例 */
    private static _instance: ModelManager = new ModelManager();

    /** 数据model集合 */
    private _modelList: Map<any, any>;

    /**
     * @constructor
     * @private
     */
    private constructor() {
        this._modelList = new Map();
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
    public getModel<T extends BaseModel>(model: new () => T): T {
        let key = model;
        return this._modelList.get(key);
    }

    /**
     * 注册数据model
     * @param {{new (): BaseModel}} model
     */
    public registerModel(model: new () => BaseModel): void {
        let key = model;
        if (this._modelList.get(key)) {
            console.log(key, "已经存在，不可重复注册！");
        } else {
            let m = new model();
            m.__init__();
            this._modelList.set(key, m);
        }
    }

    /**
     * 移除注册
     * @param {{new (): BaseModel}} model
     */
    public unregisterModel(model: new () => BaseModel): void {
        let key = model;
        if (this._modelList.get(key)) {
            let m: BaseModel = this._modelList.get(key);
            m.clear();
            this._modelList.delete(key);
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
            this._modelList.delete(key);
        }
        this._modelList = null;
    }

    /** 清理所有model */
    public clearAllModel(): void {
        let keyList = Array.from(this._modelList.keys());
        for (let key of keyList) {
            let model: BaseModel = this._modelList.get(key);
            if (model) {
                model.clear();
            }
        }
    }

    /** 重新初始化所有model */
    public reInitAllModel(): void {
        let keyList = Array.from(this._modelList.keys());
        for (let key of keyList) {
            let model: BaseModel = this._modelList.get(key);
            if (model) {
                model.init();
            }
        }
    }
}
