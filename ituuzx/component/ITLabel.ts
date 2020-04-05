/**
 * 多语言文本框
 * 直接设置string属性没有效果，应该调用setString接口或者在编辑器中设置[文案KEY]
 * @author ituuz
 */
import LanguageUtil from "../core/util/LanguageUtil";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("IT Component/ITLabel")
export default class ITLabel extends cc.Label {

    @property({
    })
    private _key: string = "#default";
    @property({
        type: cc.String,
        displayName: "文案KEY"
    })
    get key(): string {
        return this._key;
    }
    set key(t) {
        this._key = t;
        this._refreshPropertyPanel();
    }

    /** 动态文本参数数组 */
    private _param: string[] = [];
    get param(): string[] {
        return this._param;
    }
    set param(t: string[]) {
        this._param = t;
        this._refreshPropertyPanel();
    }

    public start() {
    }

    /**
     * 设置语言内容
     * @param {string}key 语言key
     * @param {Array<string>}param 可选动态替换参数
     * @param {boolean}needLanguage 是否需要多语言 true 根据key查找多语言，false key 就是实际显示内容  
     */
    public setString(key: string, arr: string[] = [], needLanguage: boolean = true): void {
        this._key = key;
        this._param = arr;
        this._refreshPropertyPanel(needLanguage);
    }

    /** 根据KEY和动态参数获取字符串 */
    private _getStringByKey(key: string, arr: string[]): string {
        return LanguageUtil.getStr(key, arr);
    }

    /** 刷新组件显示 */
    private _refreshPropertyPanel(needLanguage: boolean = true) {
        if (needLanguage === true) {
            this.string = this._getStringByKey(this._key, this._param);
        }
    }

    /** 更新文本框内容显示 2.2.0后修改为(_lazyUpdateRenderData) */
    // _updateRenderData(force) { // 2.2之前的刷新接口
    public _lazyUpdateRenderData(force) {
        // @ts-ignore
        super._lazyUpdateRenderData(force);
        this.string = this._getStringByKey(this._key, this._param);
    }

}
