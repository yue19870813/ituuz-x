import LogUtil from "../../util/LogUtil";
/**
 * 单个UI界面的Atlas对象，负责管理该界面的图集资源；
 * @author ituuz
 */
export default class ITUIAtlas {
    /** 该UI使用的图集map集合 */
    private _atlasMap: Map<string, ITAtlas> = new Map<string, ITAtlas>();

    public constructor() {

    }

    /**
     * 添加该UI需要加载的atlas资源
     * @param {string} key 资源key值，默认就是图集的路径。
     * @param {MiAtlas} atlas 图集对象
     */
    public addAtlas(key: string, atlas: ITAtlas): void {
        this._atlasMap.set(key, atlas);
    }

    /**
     * 为sprite设置纹理
     * @param {cc.Sprite} sprite sprite对象
     * @param {string} name 纹理名称
     * @param {string} key 图集key值，如果不传key，则默认使用该UI的第一个图集来设置；
     */
    public setSpriteFrame(sprite: cc.Sprite, name: string, key?: string): void {
        if (key) {
            let atlas = this._atlasMap.get(key);
            if (atlas) {
                atlas.setSpriteFrame(sprite, name);
            }
        } else {
            let keys = this._atlasMap.keys();
            let keyList = Array.from(keys);
            for (let k of keyList) {
                let atlas = this._atlasMap.get(k);
                if (atlas) {
                    // 如果不传key，则默认使用该UI的一个图集来设置；
                    atlas.setSpriteFrame(sprite, name);
                    break;
                }
            }
        }
    }

    public get atlasMap(): Map<string, ITAtlas> {
        return this._atlasMap;
    }
}

/**
 * 单个图集对象
 * @author Yue
 */
export class ITAtlas {
    /** 该图集是否加载完成 */
    private _loaded: boolean = false;
    /** 加载的错误信息 */
    private _loadError: any = null;
    /** 图集对象 */
    private _atlas: cc.SpriteAtlas;
    /** 资源路径 */
    private _url: string;

    /** 待显示的sprite等待管线 */
    private _spritePipe: {name: string, callback: (err, frame) => void}[] = [];

    public constructor(url: string) {
        this._url = url;
    }

    /**
     * 通过缓存设置sprite纹理
     * @param {string} name 纹理名称
     * @param {(err, frame) => void} callback 纹理设置完成回调
     */
    private cacheLoad(name: string, callback: (err, frame) => void): void {
        if (this._loadError) {
            LogUtil.warn(`atlas [${this._url}] load failed`);
        } else {
            let frame = this._atlas.getSpriteFrame(name);
            if (frame) {
                if( callback) { callback(null, frame); }
            } else {
                LogUtil.warn(`spriteframe [${name}] not found in atlas [${this._url}]`);
            }
        }
    }

    /**
     * 从缓存或者异步加载纹理图集
     * @param {string} name 图集名称
     * @param {callback: (err, frame) => void} callback 加载完成回调
     */
    private loadSpriteFrame(name: string, callback: (err, frame) => void) {
        if (this._loaded) {
            this.cacheLoad(name, callback);
        } else {
            this._spritePipe.push({name, callback});
        }
    }

    /**
     * 为sprite设置纹理
     * @param {cc.Sprite} sprite sprite组件对象
     * @param {string} name 纹理名称
     */
    public setSpriteFrame(sprite: cc.Sprite, name: string): void {
        this.loadSpriteFrame(name, (err, frame) => {
            if (!err) {
                if (sprite) {
                    sprite.spriteFrame = frame;
                } else {
                    LogUtil.log("[ITAtlas] sprite is null!");
                }
            } else {
                LogUtil.warn(err);
                LogUtil.log(`[ITAtlas] can't find frame name: ${name}`);
            }
        });
    }

    /**
     * 图集加载完成调用的接口，此处为私有接口，在AtlasMananger中要隐式调用，反射；
     * @param {any} err 加载错误信息
     * @param {cc.SpriteAtlas} atlas 图集
     */
    private atlasLoaded(err: any, atlas: cc.SpriteAtlas): void {
        this._atlas = atlas;
        this._loadError = err;
        this._loaded = true;
        // 设置管线中的sprite
        for (let pipe of this._spritePipe) {
            this.cacheLoad(pipe.name, pipe.callback);
        }
        // 清空管线
        this._spritePipe = [];
    }
}