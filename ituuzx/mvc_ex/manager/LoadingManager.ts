import { ViewManager } from "../../core/mvc/manager/ViewManager";
import { MVC_struct } from "../../Framework";
import GameMediator from "../base/GameMediator";

/**
 * 加载管理管理
 * @author ituuz
 */
export class LoadingManager {
    /** loading界面预制体实例 */
    private static _view: ITLoadingView;
    /** 进度条节点名称 */
    private static _progress: string;
    /** 常驻顶层节点 */
    private static _prersistNode: cc.Node;

    /**
     * 初始化通用loading界面
     * @param {cc.Prefab} prefab loading界面预制
     * @param {string} progress 进度条节点名称
     * @param {cc.Node} prersistNode 常驻节点
     */
    public static init(prefab: cc.Prefab, progress?: string, prersistNode?: cc.Node, mvc?: MVC_struct): void {
        let node = cc.instantiate(prefab);
        node.name = "__ITLoadingView";
        prersistNode.addChild(node);
        node.x = cc.winSize.width / 2;
        node.y = cc.winSize.height / 2;
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        LoadingManager._view = new ITLoadingView(node);
        LoadingManager._progress = progress;
        if (prersistNode) {
            LoadingManager._prersistNode = prersistNode;
        } else {
            let pNode = new cc.Node();
            pNode.name = "it_prersistNode";
            let scene = cc.director.getScene();
            scene.addChild(pNode);
            cc.game.addPersistRootNode(pNode);
            LoadingManager._prersistNode = pNode;
        }
        LoadingManager._view.close();
    }

    public static show(): ITLoadingView {
        LoadingManager._view.show();
        return LoadingManager._view;
    }

    public static close(): void {
        LoadingManager._view.close();
    }
}

export class ITLoadingView {

    private _node: cc.Node;

    public constructor(node: cc.Node) {
        this._node = node;
    }

    public update(p: number): void {

    }

    public close(): void {
        this._node.active = false;
        if (ViewManager.getInstance().curScene) {
            (ViewManager.getInstance().curScene as GameMediator).onLoadingClosed();
        }
    }

    public play(anim: string): void {

    }

    private reset(): void {

    }

    public show(): void {
        this.reset();
        this._node.active = true;
    }
}
