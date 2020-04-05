import FrameworkCfg from "../../FrameworkCfg";
import BaseCommand from "./base/BaseCommand";
import BaseMediator from "./base/BaseMediator";
import BaseModel from "./base/BaseModel";
import BaseScene from "./base/BaseScene";
import { BaseView } from "./base/BaseView";
import { OPEN_VIEW_OPTION } from "./Constants";
import CommandManager from "./manager/CommandManager";
import ModelManager from "./manager/ModelManager";
import { ViewManager } from "./manager/ViewManager";

export class Facade {
    /** 实例对象 */
    private static _instance: Facade = new Facade();
    /** 框架是否被初始化 */
    private static _isInit: boolean = false;

    private constructor() {

    }

    public static getInstance(): Facade {
        return this._instance;
    }

    /**
     * 初始化框架配置
     * @param {boolean} debug 是否是调试状态
     * @param {cc.Size} designResolution 设计分辨率
     * @param {boolean} fitHeight 是否高适配
     * @param {boolean} fitWidth 是否宽适配
     */
    public init(debug: boolean, designResolution: cc.Size, fitHeight: boolean, fitWidth: boolean): void {
        if (Facade._isInit) {
            it.warn("框架已经初始化，不需要重复初始化。");
            return;
        }
        Facade._isInit = true;
        FrameworkCfg.DEBUG = debug;
        FrameworkCfg.DESIGN_RESOLUTION = designResolution;
        FrameworkCfg.FIT_HEIGHT = fitHeight;
        FrameworkCfg.FIT_WIDTH = fitWidth;
    }

    /**
     * 运行场景
     * @param {{new(): BaseMediator}} mediator 场景mediator类型，类类型。
     * @param {{new(): BaseScene}} view 场景mediator类型，类类型。
     * @param {Object} data 自定义的任意类型透传数据。（可选）
     * @param {()=>void} cb 加载完成回调.
     */
    public runScene(mediator: new() => BaseMediator, view: new() => BaseScene, data?: any, cb?: (med: BaseMediator) => void): BaseMediator {
        if (Facade._isInit) {
            return ViewManager.getInstance().__runScene__(mediator, view, data, cb);
        } else {
            it.warn("框架没有初始化，请先调用init接口进行初始化。");
            return null;
        }
    }

    /**
     * 返回上一场景
     * @returns {boolean}是否存在上一个场景
     */
    public backScene(): boolean {
        return ViewManager.getInstance().__backScene__();
    }

    /**
     * 打开view界面，弹出界面
     * @param {{new(): BaseMediator}} mediator 界面mediator类型，类类型。
     * @param {{new(): BaseView}} view view 场景mediator类型，类类型。
     * @param {Object} data 自定义的任意类型透传数据。（可选）
     * @param {(view: BaseView)=>void} cb 加载完成回调.
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    public popView(mediator: new() => BaseMediator, view: new() => BaseView, name: string,
                   data?: any, cb?: (view: BaseView) => void, useCache?: boolean): void {
        ViewManager.getInstance().__showView__(mediator, view, name, data, OPEN_VIEW_OPTION.OVERLAY, 0, cb, null, useCache);
    }

    /**
     * 创建view层，此接口用于初始不会被关闭和再次打开的常驻界面，所以它也不会受到pooView影响和管理。
     * @param {{new(): BaseMediator}} mediator 界面mediator类型，类类型。
     * @param {{new(): BaseView}} view view 场景mediator类型，类类型。
     * @param {number} zOrder ui层级
     * @param {Object} data 自定义的任意类型透传数据。（可选）
     * @param {(view: BaseView)=>void} cb 加载完成回调
     * @param {cc.Node} parent 父节点
     */
    public addLayer(mediator: new() => BaseMediator, view: new() => BaseView, name: string,
                    zOrder?: number, data?: any, cb?: (view: BaseView) => void, parent?: cc.Node): void {
        ViewManager.getInstance().__showView__(mediator, view, name, data, OPEN_VIEW_OPTION.LAYER, zOrder, cb, parent, false);
    }

    /**
     * 撤销命令
     * @param {{new (): BaseCommand}} command 命令对象
     * @param {Object} body 命令参数
     */
    public __undoCommand__(command: new () => BaseCommand, body?: any): void {
        CommandManager.getInstance().__undoCommand__(command, body);
    }

    /**
     * 注册数据model
     * @param {{new (): BaseModel}} model
     */
    public registerModel(model: new () => BaseModel): void {
        ModelManager.getInstance().registerModel(model);
    }

    /**
     * 获取model对象
     * @param {{new (): BaseModel}} model
     */
    public getModel<T extends BaseModel>(model: new () => T): T {
        return ModelManager.getInstance().getModel(model);
    }

    /** 获取当前场景 */
    public getCurScene(): BaseMediator {
        return ViewManager.getInstance().curScene;
    }

    /** 获取层级列表 */
    public getLayerList(): BaseMediator[] {
        return ViewManager.getInstance().layerViewList;
    }

    /** 根据名字获取mediator */
    public getViewByName(name: string): BaseMediator {
        let layerList = ViewManager.getInstance().layerViewList;
        for (let layer of layerList) {
            if (layer.medName === name) {
                return layer;
            }
        }
    }
}

/** 导入到全局属性mvc中的对外接口和属性等api */
(window as any).mvc = {
    appFacade: Facade.getInstance()
};

// 创建全局UI事件列表容器，用于缓存Mediator中监听的View事件列表
// tslint:disable-next-line: no-unused-expression
(window as any).__ViewEventList__ || ((window as any).__ViewEventList__ = new Map());

// ---------------------- 装饰器声明 --------------------------
it.log("----------------- 装饰器声明 --------------------------");
/**
 * 监听View事件装饰器
 * @param {string} params View事件名称
 */
function addviewevent(params: string) {
    // it.log(params) // 装饰器传入的参数
    return (target: any, methodName:any, desc:any) => {
        // 获取类名
        let clsName = target.constructor.name;
        // 保存类及回调函数
        let map = ((window as any).__ViewEventList__ as Map<string, {key: string, func: string}[]>);
        let data = map.get(clsName);
        if (data) {
            data.push({key: params, func: methodName});
        } else {
            let arr = [];
            arr.push({key: params, func: methodName});
            map.set(clsName, arr);
        }
        // it.log(`监听View事件装饰器-类名 = ${clsName}, 事件名称 = ${params}`);
    }
}

(window as any).addviewevent = addviewevent;
