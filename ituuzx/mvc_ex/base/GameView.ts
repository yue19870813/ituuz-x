/**
 * 游戏UI view层的基类
 * @author ituuz
 * @example
 * // 子类重写该函数来实现图集的自动加载和释放
 * public atlasName(): string[] {
 *   return [
 *      "atlasPath1",
 *      "atlasPath2"
 *   ];
 * }
 * // 使用如下接口来为sprite设置纹理
 * setSpriteFrame(sprite, "atlasPath1");
 */
import { BaseView } from "../../core/mvc/base/BaseView";
import ITUIAtlas from "../../core/load/atlas/ITAtlas";
import AtlasManager from "../../core/load/atlas/AtlasManager";

export default class GameView extends BaseView {
    /** 用于获取纹理贴图对象 */
    private _uiAtlas: ITUIAtlas;

    /** @override */
    public __init__(): void {
        super.__init__();
        this.loadAtlas();
        this.onShow();
    }

    /** @override */
    public onShow(): void {

    }

    /** 开始加载atlas */
    private loadAtlas(): void {
        this._uiAtlas = new ITUIAtlas();
        let atlasList = this.atlasName();
        for (let atlas of atlasList) {
            // 通过AtlasManager加载图集纹理资源，并返回图集引用；
            let itAtlas = AtlasManager.loadAtlas(atlas);
            // 将图集引用添加到当前UI对象中，方便使用。
            this._uiAtlas.addAtlas(atlas, itAtlas);
        }
    }

    /**
     * 为sprite设置纹理
     * @param {cc.Sprite} sprite sprite对象
     * @param {string} name 纹理名称
     * @param {string} key 图集key值，如果不传key，则默认使用该UI的第一个图集来设置；
     */
    public setSpriteFrame(sprite: cc.Sprite, name: string, key?: string): void {
        this._uiAtlas.setSpriteFrame(sprite, name, key);
    }

    /**
     * 子类重写来实现资源的加载和释放
     */
    public atlasName(): string[] {
        return [];
    }

    /** @override */
    public onClose(): void {
        let atlasMap = this._uiAtlas.atlasMap;
        let keys = atlasMap.keys();
        let keyList = Array.from(keys);
        for (let k of keyList) {
            AtlasManager.releaseAtlas(k);
        }
    }

}
