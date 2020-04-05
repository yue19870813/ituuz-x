import LanguageUtil from "../core/util/LanguageUtil";

/**
 * 多语言sprite
 * 直接设置spriteFrame属性没有效果，应该调用setSpriteFrameName接口或者在编辑器中设置[纹理名称]
 * @author ituuz
 * @todo _updateColor 在编辑器中会无限报错
 */
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("IT Component/ITSprite")
export default class ITSprite extends cc.Sprite {

    @property({
    })
    private _spriteFrameName: string = "default";

    @property({
        type: cc.String,
        displayName: "纹理名称"
    })
    get spriteFrameName(): string {
        return this._spriteFrameName;
    }
    set spriteFrameName(name: string) {
        this._spriteFrameName = name;
        this._refreshPropertyPanel();
    }

    @property({
        readonly: true,
        displayName: "UUID",
        visible: false
    })
    public mUuid: string = "";

    /** 是否加载完成 */
    private _isLoaded: boolean = false;

    public start() {

    }

    public setSpriteFrameName(name: string): void {
        this.spriteFrameName = name;
    }

    public _refreshPropertyPanel(): void {
        this._resetSpriteFrame();
    }

    public _updateColor() {
        if (CC_EDITOR) {
            // todo nothing
        } else {
            // @ts-ignore
            super._updateColor();
        }
    }

    /**
     * 重置纹理
     */
    private _resetSpriteFrame(): void {
        if (CC_EDITOR) {
            // @ts-ignore
            let atlas: cc.SpriteAtlas = this._atlas;
            let spriteframe = atlas.getSpriteFrame(this.spriteFrameName + "_" + LanguageUtil.CUR_LAN);
            if (spriteframe) {
                this.spriteFrame = spriteframe;
            }
            // @ts-ignore
            this.mUuid = atlas._uuid;
        } else {
            if (!this._isLoaded) {
                this.spriteFrame = null;
            }
            cc.loader.load({
                uuid: this.mUuid,
                type: "uuid"
            }, (err, asset) => {
                this.spriteFrame = asset._spriteFrames[this.spriteFrameName + "_" + LanguageUtil.CUR_LAN];
                this._isLoaded = true;
            });
        }
    }

    /**
     * 刷新编辑器显示
     */
    public markForUpdateRenderData(enable): void {
        // @ts-ignore
        super.markForUpdateRenderData(enable);
        this._resetSpriteFrame();
    }

}
