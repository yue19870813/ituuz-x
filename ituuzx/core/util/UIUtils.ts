import { BaseView } from "../mvc/base/BaseView";
// import FsAudioUtil from "../../../script/utils/FsAudioUtils";

/**
 * UIUtils:解析UI节点工具类
 * @author ituuz
 */
export default class UIUtils {

    /***
     * 生成子节点的唯一标识快捷访问
     * @param node
     * @param map
     */
    public static createSubNodeMap(node: cc.Node, map: Map<string, cc.Node>) {
        let children = node.children;
        if (!children) {
            return;
        }
        for (let t = 0, len = children.length; t < len; ++t) {
            let subChild = children[t];
            map.set(subChild.name, subChild);
            UIUtils.createSubNodeMap(subChild, map);
        }
    }

    /**
     * 返回当前节点所有节点,一唯一标识存在
     * @param node 父节点
     * @return {Object} 所有子节点的映射map
     */
    public static seekAllSubView(node: cc.Node): UIContainer {
        let map = new Map<string, cc.Node>();
        UIUtils.createSubNodeMap(node, map);
        return new UIContainer(map);
    }
}

export class UIContainer {
    /** 所有节点集合 */
    private _uiNodesMap: Map<string, cc.Node>;

    private _target: BaseView;

    public constructor(nodesMap: Map<string, cc.Node>) {
        this._uiNodesMap = nodesMap;
    }

    public setTarget(t: BaseView): void {
        this._target = t;
    }

    /**
     * 根据节点名字获取节点
     * @param {string}name 节点名字
     * @return {cc.Node}
     */
    public getNode(name: string): cc.Node {
        return this._uiNodesMap.get(name);
    }

    /**
     * 根据节点名字和组件类型获取组件对象
     * @param {string}name 节点名字
     * @param {{prototype: cc.Component}}com 组建类型
     * @return {cc.Component}
     */
    public getComponent<T extends cc.Component>(name: string, com: { prototype: T }): T {
        let node = this._uiNodesMap.get(name);
        if (node) {
            return node.getComponent(com);
        }
        return null;
    }

    /**
     * 注册或发送点击事件，默认带点击音效
     * @param {cc.Node | string} node 事件节点  
     * @param {string | (event: any) => void} handler 事件名称 | 事件回调函数 
     * @param {any} target 目标 
     * @param {any} param 参数 
     * @param {string} sound 声音，有默认 
     */
    public onClick<T extends (event: any) => void>(node: cc.Node | string, handler: string | T, target?: any, param?: any, sound?: string): void {
        if (!node) {
            it.warn(`onClick参数node不能为空：${node}`);
            return;
        }
        let tempNode: cc.Node = null;
        if (typeof node === "string") {
            tempNode = this.getNode(node);
        } else {
            tempNode = node;
        }
        tempNode.on(cc.Node.EventType.TOUCH_END, (event) => {
            // 播放音效
            if (sound) {
                // FsAudioUtil.playEffect(sound);
            } else {
                // FsAudioUtil.playEffect("common_button");
            }
            if (typeof handler === "string") {
                this._target.sendEvent(handler, param);
            } else {
                if (handler) { handler.apply(target, event); }
            }
        }, target);
    }
}

// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.UIUtils = UIUtils;
