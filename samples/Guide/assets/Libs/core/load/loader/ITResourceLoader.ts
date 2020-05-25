import LogUtil from "../../util/LogUtil";
import AtlasLoader from "./base/AtlasLoader";
import AudioLoader from "./base/AudioLoader";
import BaseLoader from "./base/BaseLoader";
import ImageLoader from "./base/ImageLoader";
import JsonLoader from "./base/JsonLoader";
import PrefabLoader from "./base/PrefabLoader";
import TextLoader from "./base/TextLoader";

export default class ITResourceLoader {

    // 加载器map集合
    private static _defaultMap: Map<{prototype: cc.Asset}, BaseLoader>;

    // loader加载器实例
    private static _imageLoader: ImageLoader = new ImageLoader();
    private static _atlasLoader: AtlasLoader = new AtlasLoader();
    private static _prefabLoader: PrefabLoader = new PrefabLoader();
    private static _textLoader: TextLoader = new TextLoader();
    private static _jsonLoader: JsonLoader = new JsonLoader();
    private static _audioLoader: AudioLoader = new AudioLoader();

    public static init(): void {
        // 初始化加载器map
        ITResourceLoader._defaultMap = new Map();

        // image loader
        ITResourceLoader._defaultMap.set(cc.SpriteFrame, ITResourceLoader._imageLoader);
        // atlas loader
        ITResourceLoader._defaultMap.set(cc.SpriteAtlas, ITResourceLoader._atlasLoader);
        // prefab loader
        ITResourceLoader._defaultMap.set(cc.Prefab, ITResourceLoader._prefabLoader);
        // text loader
        ITResourceLoader._defaultMap.set(cc.TextAsset, ITResourceLoader._textLoader);
        // json loader
        ITResourceLoader._defaultMap.set(cc.JsonAsset, ITResourceLoader._jsonLoader);
        // audio loader
        ITResourceLoader._defaultMap.set(cc.AudioClip, ITResourceLoader._audioLoader);
        // TODO dragonbone loader
        // TODO spine loader
        // TODO tilemap loader
    }

    /**
     * 资源统一加载接口
     * @param {string} path 资源路径
     * @param {cc.Asset} type 资源类型
     * @param {(err, res) => void} callback 加载完成回调
     */
    public static loadRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void {
        // 根据资源类型获取对应的加载器
        let itemLoader = ITResourceLoader._defaultMap.get(type);
        if (itemLoader) {
            itemLoader.loadRes(path, type, callback);
        } else {
            LogUtil.error(`[ITResourceLoader]The type [${type}] of res [${path}] is not support yet!`);
            cc.loader.loadRes(path, type, callback);
        }
    }

    /**
     * 加载资源列表
     * @param list 
     * @param processCB 
     * @param succCB 
     */
    public static loadResList(list: {url: string, type: cc.Asset}[], processCB: () => void, succCB: () => void): void {
        if (!list || list.length <= 0) {
            if (succCB) { succCB(); }
            return;
        }
        // 开始加载资源
        ITResourceLoader._loadResList(list, processCB, succCB);
    }

    private static _loadResList(list: {url: string, type: cc.Asset}[], processCB: () => void, succCB: () => void): void {
        if (list.length <= 0) {
            if (succCB) { succCB(); }
            return;
        }
        let resItem = list.shift();
        ITResourceLoader.loadRes(resItem.url, resItem.type as any, () => {
            if (processCB) {
                processCB();
            }
            ITResourceLoader._loadResList(list, processCB, succCB);
        });
    }

    /**
     * 加载prefab
     * @param {string} path prefab路径
     */
    public static async loadPrefab(path: string) {
        return new Promise<any>((resolve, reject) => {
            it.loader.loadRes(path, cc.Prefab, (err, res) => {
                if (err) {
                    it.error(err);
                }
                resolve(cc.instantiate(res));
            });
        });
    }
}

// 默认初始化加载器管理类
ITResourceLoader.init();

// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.loader = ITResourceLoader;
