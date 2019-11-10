import FrameworkCfg from "../../../FrameworkCfg";
import BaseMediator from "../base/BaseMediator";
import BaseScene from "../base/BaseScene";
import { BaseView } from "../base/BaseView";
import { OPEN_VIEW_OPTION } from "../Constants";
import ITResourceLoader from "../../load/loader/ITResourceLoader";

/**
 * mvc框架控制类
 * @author ituuz
 * @description 负责控制和维护框架各个节点和结构间的跳转和关联。
 */
export class ViewManager {

    // 实例
    private static _instance: ViewManager = new ViewManager();

    /** 上一场景类 */
    private _preSceneMediatorCls: new() => BaseMediator = null;
    private _preSceneViewCls: new() => BaseScene = null;
    /** 当前场景类 */
    private _curSceneMediatorCls: new() => BaseMediator = null;
    private _curSceneViewCls: new() => BaseScene = null;

    /** 当前场景 */
    private _curScene: BaseMediator;
    /** 当前显示的pop view列表 */
    private _popViewList: BaseMediator[];
    /** 当前显示的layer view列表 */
    private _layerViewList: BaseMediator[];
    /** 当前场景Layer的最高层级 */
    private _maxLayerZorder: number = 0;

    /**
     * @constructor
     * @private
     */
    private constructor() {
        this._popViewList = [];
        this._layerViewList = [];
    }

    /**
     * 单例获取类
     */
    public static getInstance(): ViewManager {
        return this._instance;
    }

    /**
     * 运行场景
     * @param {{new(): BaseMediator}} mediator 场景mediator类型，类类型。
     * @param {{new(): BaseScene}} view 场景mediator类型，类类型。
     * @param {Object} data 自定义的任意类型透传数据。（可选）
     * @param {()=>void} cb 加载完成回调.
     * @private
     */
    public __runScene__(mediator: new() => BaseMediator, view: new() => BaseScene, data?: any, cb?: (med: BaseMediator) => void): void {
        // 初始化场景全局层级缓存
        this._maxLayerZorder = 0;
        // 创建并绑定场景
        let sceneMediator: BaseMediator = new mediator();
        // 如果前一场景不为空则进行清理
        if (this._curScene) {
            this._curScene.destroy();
        }

        // 保存当前场景
        this._curScene = sceneMediator;
        // tslint:disable-next-line: no-string-literal
        sceneMediator["__init__"]();
        sceneMediator.init(data);

        if (this._curSceneMediatorCls != null && this._curSceneViewCls != null) {
            this._preSceneMediatorCls = this._curSceneMediatorCls;
            this._preSceneViewCls = this._curSceneViewCls;
        }

        this._curSceneMediatorCls = mediator;
        this._curSceneViewCls = view;

        // 处理场景显示逻辑
        let scenePath: string = (view as any).path();
        if (scenePath === "") {
            let ccs = new cc.Scene();
            ccs.name = "Scene";
            let canvasNode = new cc.Node();
            canvasNode.name = "Canvas";
            let canvas = canvasNode.addComponent(cc.Canvas);
            canvas.designResolution = FrameworkCfg.DESIGN_RESOLUTION;
            canvas.fitHeight = FrameworkCfg.FIT_HEIGHT;
            canvas.fitWidth = FrameworkCfg.FIT_WIDTH;
            sceneMediator.view = canvasNode.addComponent(view);
            sceneMediator.view.__init__();
            ccs.addChild(canvasNode);
            // 这里延迟1ms是为了让场景在下一帧加载
            setTimeout(() => {
                this.__closeAllView__();
                cc.director.runSceneImmediate(ccs);
                sceneMediator.viewDidAppear();
                if (cb) { cb(sceneMediator); }
            }, 1);
        } else {
            this.__closeAllView__();
            cc.director.loadScene(scenePath, () => {
                let canvas = cc.director.getScene().getChildByName("Canvas");
                if (canvas) {
                    sceneMediator.view = canvas.addComponent(view);
                    sceneMediator.view.__init__();
                    sceneMediator.viewDidAppear();
                    if (cb) { cb(sceneMediator); }
                } else {
                    it.log("场景中必须包含默认的Canvas节点！");
                }
            });
        }
    }

    /**
     * 返回上一场景
     * @returns {boolean}是否存在上一个场景
     */
    public __backScene__(): boolean {
        if (this._preSceneMediatorCls && this._preSceneViewCls) {
            this.__runScene__(this._preSceneMediatorCls, this._preSceneViewCls);
            return true;
        }
        return false;
    }

    /**
     * 打开view界面
     * @param {{new(): BaseMediator}} mediator 界面mediator类型，类类型。
     * @param {{new(): BaseView}} view view 场景mediator类型，类类型。
     * @param {Object} data 自定义的任意类型透传数据。（可选）
     * @param {OPEN_VIEW_OPTION} option 打开ui的操作选项，枚举类型。
     * @param {number} zOrder 层级。
     * @param {(view: BaseView)=>void} cb 加载完成回调.
     * @param {boolean} useCache 是否复用已存在的view 可选
     */
    public __showView__(mediator: new() => BaseMediator, view: new() => BaseView, data?: any,
                        option?: OPEN_VIEW_OPTION, zOrder?: number, cb?: (view: BaseView) => void,
                        parent?: cc.Node, useCache?: boolean): void {

        // 如果使用缓存，则查找是否有缓存，如果有直接使用缓存对象，然后调整层级到最高
        if (useCache) {
            let isUseCache = this.useCache(mediator);
            if (isUseCache) {
                return;
            }
        }
        // 处理打开UI的其他操作
        this.openViewOptionHandler(option);

        // 创建并绑定view
        let viewMediator: BaseMediator = new mediator();
        // tslint:disable-next-line: no-string-literal
        viewMediator["_name"] = mediator;
        // tslint:disable-next-line: no-string-literal
        viewMediator["__init__"]();

        // 处理场景显示逻辑
        let viewPath: string = (view as any).path();
        if (viewPath === "") {
            let viewNode = new cc.Node();
            viewMediator.init(data);
            this.initViewMediator(viewMediator, viewNode, view, option, zOrder, parent);
            viewMediator.viewDidAppear();
            if (cb) { cb(viewMediator.view); }
        } else {
            ITResourceLoader.loadRes(viewPath, cc.Prefab, (err, prefab) => {
                if (err) {
                    it.error(err);
                    return;
                }
                let viewNode = cc.instantiate(prefab);
                viewMediator.init(data);
                this.initViewMediator(viewMediator, viewNode, view, option, zOrder, parent);
                viewMediator.viewDidAppear();
                if (cb) { cb(viewMediator.view); }
            });
        }
    }

    /** 当需要复用缓存view时 */
    private useCache(mediator: new() => BaseMediator): boolean {
        let isExist = false;
        for (let med of this._popViewList) {
            if (mediator === med["_name"]) {
                med.view.node.zIndex = this._maxLayerZorder + 20;
                isExist = true;
            } else {
                med.view.node.zIndex = this._maxLayerZorder + 10;
            }
        }
        return isExist;
    }

    /**
     * 初始化ViewMediator
     * @param {BaseMediator} mediator ViewMediator
     * @param {cc.Node} viewNode view显示节点
     * @param {{new(): BaseView}} view view显示组件类
     * @param {OPEN_VIEW_OPTION} option 打开选项
     * @param {number} zOrder 层级排序
     */
    private initViewMediator(mediator: BaseMediator, viewNode: cc.Node, view: new() => BaseView,
                             option?: OPEN_VIEW_OPTION, zOrder?: number, parent?: cc.Node): void {

        mediator.view = viewNode.addComponent(view);
        if (parent) {
            parent.addChild(viewNode);
        } else {
            cc.director.getScene().getChildByName("Canvas").addChild(viewNode);
        }
        mediator.view.__init__();
        // 根据不同打开类型，存储到不同队列中。
        if (option === OPEN_VIEW_OPTION.OVERLAY || option === OPEN_VIEW_OPTION.SINGLE) {
            // 这里处理层级设置：保障popview层级大于layer层级，这里固定大于10.
            viewNode.zIndex = this._maxLayerZorder + 10;
            this._popViewList.push(mediator);
        } else if (option === OPEN_VIEW_OPTION.LAYER) {
            viewNode.zIndex = zOrder;
            this._layerViewList.push(mediator);
            if (zOrder > this._maxLayerZorder) {
                this._maxLayerZorder = zOrder;
            }
        }
    }

    /**
     * 关闭指定View
     * @param view
     * @private
     */
    public __closeView__(view: BaseView): void {
        for (let i = 0; i < this._popViewList.length; i++) {
            if (this._popViewList[i].view === view) {
                this._popViewList.splice(i, 1);
                return;
            }
        }
        for (let i = 0; i < this._layerViewList.length; i++) {
            if (this._layerViewList[i].view === view) {
                this._layerViewList.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 关闭所有弹出窗口
     * @private
     */
    public __closeAllPopView__(): void {
        for (let popView of this._popViewList) {
            popView["__destroy__"]();
        }
        this._popViewList = [];
    }

    /**
     * 关闭所有添加层级
     * @private
     */
    public __closeAllAddLayer__(): void {
        for (let layerView of this._layerViewList) {
            // tslint:disable-next-line: no-string-literal
            layerView["__destroy__"]();
        }
        this._layerViewList = [];
    }

    /**
     * 关闭所有view
     * @private
     */
    public __closeAllView__(): void {
        this.__closeAllPopView__();
        this.__closeAllAddLayer__();
    }

    /**
     * 根据参数处理ui的打开方式
     * @param option
     * @private
     */
    private openViewOptionHandler(option: OPEN_VIEW_OPTION): void {
        // 设置默认值
        if (!option) {
            option = OPEN_VIEW_OPTION.OVERLAY;
        }
        // 根据不同操作做不同处理
        if (option === OPEN_VIEW_OPTION.SINGLE) {
            // TODO:暂时不提供这种关闭其他view的打开方式，可以通过BaseView.closeAllPopView()来实现。
        }
    }

    /**************************** getter and setter ******************************/
    get popViewList(): BaseMediator[] {
        return this._popViewList;
    }
    get layerViewList(): BaseMediator[] {
        return this._layerViewList;
    }
    get curScene(): BaseMediator {
        return this._curScene;
    }
}
