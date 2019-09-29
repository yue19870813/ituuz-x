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

    public constructor(nodesMap: Map<string, cc.Node>) {
        this._uiNodesMap = nodesMap;
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
}

// 将接口导出
(<any>window).it || ((<any>window).it = {});
(<any>window).it.UIUtils = UIUtils;