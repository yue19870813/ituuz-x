declare namespace it {

    export class MVC_struct {

    }

    export class BaseModel {
        
    }

    
    export class Framework {
        /**
         * 初始化框架接口
         * @param {MVC_struct} scene 初始化游戏的第一个场景
         * @param {boolean} debug 框架是否是调试模式
         * @param {cc.Size} designResolution 默认的设计分辨率
         * @param {boolean} fitWidth 是否宽适配
         * @param {boolean} fitHeight 是否高适配
         */
        static start(
            scene: MVC_struct,
            models: {new (): BaseModel}[],
            debug?: boolean, 
            designResolution?: cc.Size, 
            fitWidth?: boolean, 
            fitHeight?: boolean
        ): void;
    }

    // LogUtil 日志相关
    export function log(msg: any, ...subst: any[]): void;	
    export function warn(msg: any, ...subst: any[]): void;	
    export function debug(msg: any, ...subst: any[]): void;
    export function error(msg: any, ...subst: any[]): void;	
    /** 保存日志信息到本地文件 */
    export function saveLog(): void;
    
    /**
     * 自定义的加载接口，内部封装了各种加载器，加载资源统一调用该接口，
     * 内部对资源引用进行了处理，方便后续的资源内存优化及释放。
     */
    namespace loader {
        /**
         * 加载资源
         * @param {string} path 资源路径
         * @param {cc.Asset} type 资源类型
         * @param {(err, res) => void} callback 加载完成回调
         */
        export function loadRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void;
    }

    /** 静态数据加载及管理 */
    export class ConfigManager {
        /** 获取ConfigManager单例对象 */
        static getInstance(): ConfigManager;
        /**
         * 根据配置列表加载静态数据
         * @param {string[]} configList 配置列表，需要加载的类名。
         * @param {(count: number) => void} progressCallback 加载进度回调
         * @param {() => void} finishedCallback 加载完成回调
         */
        public loadConfList(configList: string[], progressCallback: (count: number) => void, finishedCallback: () => void): void;
        /**
         * 加载一个配置
         * @param {string} name 配置名称，需要加载的类名。
         * @param {() => void} finishedCallback 加载完成回调 
         */
        public loadConfig(name: string, finishedCallback: () => void): void;
        /**
         * 释放指定配置
         * @param {string} name 配置名称，需要释放的类名。 
         */
        public releaseConfig(name: string): void;
    }

    /** UI相关工具类 */
    export class UIUtils {
        /**
         * 返回当前节点所有节点,一唯一标识存在
         * @param node 父节点
         * @return {UIContainer} 所有子节点的映射map
         */
        public seekAllSubView(node: cc.Node): UIContainer;
    }

    export class UIContainer {
        /**
         * 根据节点名字获取节点
         * @param {string}name 节点名字
         * @return {cc.Node}
         */
        public getNode(name: string): cc.Node;

        /**
         * 根据节点名字和组件类型获取组件对象
         * @param {string}name 节点名字
         * @param {{prototype: cc.Component}}com 组建类型
         * @return {cc.Component}
         */
        public getComponent<T extends cc.Component>(name: string, com: { prototype: T }): T;
    }
}