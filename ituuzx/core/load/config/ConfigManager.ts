import JSUtil from "../../util/JSUtil";
import LogUtil from "../../util/LogUtil";
import ITResourceLoader from "../loader/ITResourceLoader";

/**
 * 静态数据管理器
 * @author ituuz
 */
export default class ConfigManager {

    private static _instance: ConfigManager = new ConfigManager();
    // 加载路径
    private _pathRoot: string = "";
    // 待加载的总数量
    private _loadMaxCount: number = 0;
    // 已经加载完成的数量
    private _loadCount: number = 0;
    // 单个加载完成回调
    private _itemLoadCallback: (count: number) => void;
    // 全部加载完成回调
    private _loadFinishedCallback: () => void;

    public static getInstance(): ConfigManager {
        return ConfigManager._instance;
    }

    private constructor() {
    }

    /**
     * 根据配置列表加载静态数据
     * @param {string[]} configList 配置列表，需要加载的类名。
     * @param {(count: number) => void} progressCallback 加载进度回调
     * @param {() => void} finishedCallback 加载完成回调
     */
    public loadConfList(configList: string[],
                        progressCallback: (count: number) => void,
                        finishedCallback: () => void,
                        pathRoot?: string): void {
        this._loadMaxCount = configList.length;
        this._itemLoadCallback = progressCallback;
        this._loadFinishedCallback = finishedCallback;
        if (pathRoot) {
            this._pathRoot = pathRoot;
        }
        this.startLoad(configList);
    }

    /** 开始加载 */
    private startLoad(configList: string[]): void {
        if (configList.length <= 0) {
            return;
        }
        let item = configList.shift();
        // 将字符串实例化成对象
        JSUtil.importCls(item).then((cls) => {
            ITResourceLoader.loadRes(this._pathRoot + cls.path(), cc.TextAsset, (err, asset: cc.TextAsset) => {
                if (err) {
                    LogUtil.error(err);
                } else {
                    cls.loadData(asset.text);
                    if (this._itemLoadCallback) { this._itemLoadCallback(++this._loadCount); }
                    if (this._loadCount >= this._loadMaxCount) {
                        if (this._loadFinishedCallback) { this._loadFinishedCallback(); }
                        this._loadCount = 0;
                        return;
                    }
                    this.startLoad(configList);
                }
            });
        });
    }

    /**
     * 加载一个配置
     * @param {string} name 配置名称，需要加载的类名。
     * @param {() => void} finishedCallback 加载完成回调 
     */
    public loadConfig(name: string, finishedCallback: () => void): void {
        ITResourceLoader.loadRes(this._pathRoot + name, cc.TextAsset, (err, asset: cc.TextAsset) => {
            if (err) {
                LogUtil.error(err);
            } else {
                // 将字符串实例化成对象
                JSUtil.importCls(name).then((cls) => {
                    cls.loadData(asset.text);
                    if (finishedCallback) { finishedCallback(); }
                });
            }
        });
    }

    /**
     * 释放指定配置
     * @param {string} name 配置名称，需要释放的类名。 
     */
    public releaseConfig(name: string): void {
        // 将字符串实例化成对象
        JSUtil.importCls(name).then((cls) => {
            cls._itemDataList = null;
            cls._itemDataMap = null;
        });
    }
}

// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.ConfigManager = ConfigManager;
