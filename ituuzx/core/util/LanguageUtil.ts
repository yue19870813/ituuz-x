import ConfigBase from "../load/config/ConfigBase";

/** 语言类型 */
export class LanguageType {
    // 简体中文
    public static ZH_CN = "zh_cn";
    // 繁体中文
    public static ZH_TW = "zh_tw";
    // 英文
    public static EN = "en";
}

/**
 * 获取指定语言和key对应的多语言内容
 */
export default class LanguageUtil {
    /** 当前语言 */
    public static CUR_LAN: string = LanguageType.ZH_CN;
    /** 多语言的静态配置 */
    private static _languageCfg: new () => ConfigBase;
    /** 初始化当前语言 */
    public static init(lan: string, cfg: new () => ConfigBase): void {
        let localLan = cc.sys.localStorage.getItem("ituuz_language");
        if (localLan && localLan !== "") {
            LanguageUtil.CUR_LAN = localLan;
            LanguageUtil._languageCfg = cfg;
            it.log("local当前语言 ====>>>> ", localLan);
            return;
        }

        LanguageUtil.CUR_LAN = lan;
        LanguageUtil._languageCfg = cfg;
        it.log("device当前语言 ====>>>> ", lan);
    }

    /**
     * 获取语言内容
     * @param {string}key 语言key
     * @param {Array<string>}param 可选动态替换参数
     */
    public static getStr(key: string, param?: string[]): string {
        let lanDataVo = ((LanguageUtil._languageCfg) as any).GetData(key);
        if (lanDataVo) {
            let str: string = lanDataVo[LanguageUtil.getLanType()];
            if (str && str !== "") {
                if (param) {
                    for (let i = 0; i < param.length; i++) {
                        str = str.replace("{" + i + "}", param[i]);
                    }
                    return str;
                } else {
                    return str;
                }
            } else {
                it.warn(`[mi warn]: The language type:${LanguageUtil.CUR_LAN} isn't in language data`);
                return key;
            }
        } else {
            it.warn(`[mi warn]:Language data is none for ${key}!`);
            return key;
        }
    }

    /** 获取对应的语言属性 */
    private static getLanType(): string {
        switch (LanguageUtil.CUR_LAN) {
            case LanguageType.ZH_CN: return "_zh_cn";
            case LanguageType.ZH_TW: return "_zh_tw";
            case LanguageType.EN: return "_en";
            default: return "_zh_cn";
        }
    }
}

(window as any).language = LanguageUtil;

// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.language = LanguageUtil;
