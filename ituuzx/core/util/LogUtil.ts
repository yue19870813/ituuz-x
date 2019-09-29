import FrameworkCfg from "../../FrameworkCfg";
import ArrayUtil from "./ArrayUtil";

/**
 * LogUtil:日志相关接口
 * @author ituuz
 */
export default class LogUtil {
    /** log标签 */
    public static GLOBAL_TAG: string = "LOG_TAG";
    /** log 日志信息 */
    private static _logStr: string = "";

    public static log(message?: any, ...optionalParams: any[]): void {
        if (FrameworkCfg.DEBUG) {
            LogUtil._logStr += "[log]" + LogUtil.GLOBAL_TAG + ":" 
                +  message + ArrayUtil.stringify(optionalParams) + "\n";
        } else {
            console.log("[log]", LogUtil.GLOBAL_TAG, ":", message, optionalParams);
        }
    }

    public static debug(message?: any, ...optionalParams: any[]): void {
        if (FrameworkCfg.DEBUG) {
            LogUtil._logStr += "[debug]" + LogUtil.GLOBAL_TAG + ":" 
                +  message + ArrayUtil.stringify(optionalParams) + "\n";
        } else {
            console.debug("[debug]", LogUtil.GLOBAL_TAG, ":", message, optionalParams);
        }
    }

    public static warn(message?: any, ...optionalParams: any[]): void {
        if (FrameworkCfg.DEBUG) {
            LogUtil._logStr += "[warn]" + LogUtil.GLOBAL_TAG + ":" 
                +  message + ArrayUtil.stringify(optionalParams) + "\n";
        } else {
            console.debug("[warn]", LogUtil.GLOBAL_TAG, ":", message, optionalParams);
        }
    }

    public static error(message?: any, ...optionalParams: any[]): void {
        if (FrameworkCfg.DEBUG) {
            LogUtil._logStr += "[error]" + LogUtil.GLOBAL_TAG + ":" 
                +  message + ArrayUtil.stringify(optionalParams) + "\n";
        } else {
            console.debug("[error]", LogUtil.GLOBAL_TAG, ":", message, optionalParams);
        }
    }

    // 写入文件保存
    public static save(): void {
        if (cc.sys.isNative) {
            let path = jsb.fileUtils.getWritablePath() + "log/" + new Date().toString() + ".txt";
            jsb.fileUtils.writeDataToFile(LogUtil._logStr, path);
            LogUtil._logStr = "";
        }
    }

}

// 将接口导出
(<any>window).it || ((<any>window).it = {});
(<any>window).it.log = LogUtil.log;
(<any>window).it.debug = LogUtil.debug;
(<any>window).it.warn = LogUtil.warn;
(<any>window).it.error = LogUtil.error;
(<any>window).it.saveLog = LogUtil.save;