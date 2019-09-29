import { ITAtlas } from "./ITAtlas";
import LogUtil from "../../util/LogUtil";
import ITResourceLoader from "../loader/ITResourceLoader";

/**
 * 图集资源管理类，负责图集加载以及引用计数
 * @author ituuz
 */

export default class AtlasManager {

    /** 图集集合 */
    private static _atlasMap: Map<string, ITAtlas> = new Map<string, ITAtlas>();
    /** 引用计数管理 */
    private static _atlasCounter: Map<string, number> = new Map<string, number>();

    /** 初始化依赖关系 */
    public static initDeps(): void {
        // TODO 根据编辑器中的依赖关系，初始化图集引用计数
    }

    /**
     * 加载图集
     * @param {string} path 图集路径
     * @param {(err, atlas) => void} callback 加载完成回调
     */
    public static loadAtlas(path: string, callback?: (err, atl) => void): ITAtlas {
        let itAtlas = AtlasManager._atlasMap.get(path);
        if (!itAtlas) {
            itAtlas = new ITAtlas(path);
            this._atlasMap.set(path, itAtlas);
            ITResourceLoader.loadRes(path, cc.SpriteAtlas, (err, atlas) => {
                itAtlas["atlasLoaded"](err, atlas);
                callback && callback(err, atlas);
            });
        }
        // 处理引用计数
        if (AtlasManager._atlasCounter.has(path)) {
            let count = AtlasManager._atlasCounter.get(path) + 1;
            AtlasManager._atlasCounter.set(path, count);
        } else {
            AtlasManager._atlasCounter.set(path, 1);
        }
        return itAtlas;
    }

    /**
     * 释放图集
     * @param {string} path 图集路径 
     */
    public static releaseAtlas(path: string): void {
        let count = this._atlasCounter.get(path);
        if (count > 1) {
            AtlasManager._atlasCounter.set(path, --count);
            LogUtil.log(`[AtlasManager] atlas(${path})引用减一，当前为:${count}`);
        } else {
            LogUtil.log(`[AtlasManager] atlas(${path})引用为0，释放!`);
            // TODO 依赖释放逻辑，同时需要分析编辑器里引用到的纹理关系，进行释放。
        }
    }
}