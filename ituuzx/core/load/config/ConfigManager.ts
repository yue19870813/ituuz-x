import SingleBase from "../../base/SingleBase";
import JSUtil from "../../util/JSUtil";
import LogUtil from "../../util/LogUtil";
import ITResourceLoader from "../loader/ITResourceLoader";

/**
 * 静态数据管理器
 * @author ituuz
 */
export default class ConfigManager extends SingleBase {

    private static _instance: ConfigManager = new ConfigManager();

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
        super();
    }

    /**
     * 根据配置列表加载静态数据
     * @param {string[]} configList 配置列表，需要加载的类名。
     * @param {(count: number) => void} progressCallback 加载进度回调
     * @param {() => void} finishedCallback 加载完成回调
     */
    public loadConfList(configList: string[], 
        progressCallback: (count: number) => void, 
        finishedCallback: () => void): void {
        this._loadMaxCount = configList.length;
        this._itemLoadCallback = progressCallback;
        this._loadFinishedCallback = finishedCallback;
        this.startLoad(configList);
    }

    /** 开始加载 */
    private startLoad(configList: string[]): void {
        if (configList.length <= 0) {
            return;
        }
        let item = configList.shift();
        ITResourceLoader.loadRes("config/" + item, cc.TextAsset, (err, asset: cc.TextAsset) => {
            if (err) {
                LogUtil.warn(err);
            } else {
                // 将字符串实例化成对象
                JSUtil.importCls(item).then((cls) => {
                    cls.loadData(asset.text);
                    this._itemLoadCallback && this._itemLoadCallback(++this._loadCount);
                    if (this._loadCount >= this._loadMaxCount) {
                        this._loadFinishedCallback && this._loadFinishedCallback();
                    }
                    this.startLoad(configList);
                });
            }
        });
    }

    /**
     * 加载一个配置
     * @param {string} name 配置名称，需要加载的类名。
     * @param {() => void} finishedCallback 加载完成回调 
     */
    public loadConfig(name: string, finishedCallback: () => void): void {
        ITResourceLoader.loadRes("config/" + name, cc.TextAsset, (err, asset: cc.TextAsset) => {
            if (err) {
                LogUtil.warn(err);
            } else {
                // 将字符串实例化成对象
                JSUtil.importCls(name).then((cls) => {
                    cls.loadData(asset.text);
                    finishedCallback && finishedCallback();
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
            cls["_itemDataList"] = null;
            cls["_itemDataMap"] = null;
        });
    }
}

// 将接口导出
(<any>window).it || ((<any>window).it = {});
(<any>window).it.ConfigManager = ConfigManager;
