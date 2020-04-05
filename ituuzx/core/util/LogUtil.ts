import FrameworkCfg from "../../FrameworkCfg";
import ArrayUtil from "./ArrayUtil";

/**
 * LogUtil:日志相关接口
 * @author ituuz
 * @description 日志分级、日志打印、日志保存
 */
export default class LogUtil {
    /** log标签 */
    public static GLOBAL_TAG: string = "LOG_TAG";
    /** log 日志信息 */
    private static _logStr: string = "";
    /** log状态 */
    private static _logStatus: boolean = true;

    public static log(message?: any, ...optionalParams: any[]): void {
        if (!LogUtil._logStatus) { return; }
        LogUtil._logStr += "[log][" + LogUtil.getFullTime() + "]" + LogUtil.GLOBAL_TAG + ":"
            + message + ArrayUtil.stringify(optionalParams) + "\n";
        // tslint:disable-next-line: no-console
        console.log("[log][", LogUtil.getFullTime(), "]", LogUtil.GLOBAL_TAG, ":", message, ...optionalParams);
    }

    public static debug(message?: any, ...optionalParams: any[]): void {
        if (!LogUtil._logStatus) { return; }
        LogUtil._logStr += "[debug][" + LogUtil.getFullTime() + "]" + LogUtil.GLOBAL_TAG + ":"
            + message + ArrayUtil.stringify(optionalParams) + "\n";
        // tslint:disable-next-line: no-console
        console.debug("[debug][", LogUtil.getFullTime(), "]", LogUtil.GLOBAL_TAG, ":", message, ...optionalParams);
    }

    public static warn(message?: any, ...optionalParams: any[]): void {
        if (!LogUtil._logStatus) { return; }
        LogUtil._logStr += "[warn][" + LogUtil.getFullTime() + "]" + LogUtil.GLOBAL_TAG + ":"
            + message + ArrayUtil.stringify(optionalParams) + "\n";
        // tslint:disable-next-line: no-console
        console.warn("[warn][", LogUtil.getFullTime(), "]", LogUtil.GLOBAL_TAG, ":", message, ...optionalParams);
    }

    public static error(message?: any, ...optionalParams: any[]): void {
        if (!LogUtil._logStatus) { return; }
        LogUtil._logStr += "[error][" + LogUtil.getFullTime() + "]" + LogUtil.GLOBAL_TAG + ":"
            + message + ArrayUtil.stringify(optionalParams) + "\n";
        // tslint:disable-next-line: no-console
        console.error("[error][", LogUtil.getFullTime(), "]", LogUtil.GLOBAL_TAG, ":", message, ...optionalParams);
    }

    /** 写入文件保存 */
    public static save(cb?: () => void): void {
        if (cc.sys.isNative) {
            let path = jsb.fileUtils.getWritablePath() + "log/" + LogUtil.getFileName();
            // @ts-ignore
            jsb.fileUtils.writeDataToFile(LogUtil._logStr, path);
            LogUtil.log("日志保存成功:", path);
            LogUtil._logStr = "";
            if (cb) { cb(); }
        }
    }

    /** 获取完全时间 */
    public static getFullTime(): string {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "-" + date.getMilliseconds();
    }

    /** 获取文件名 */
    public static getFileName(): string {
        let date = new Date();
        return date.getMonth() + "-" + date.getDay() + "_" + date.getHours() + ":" +
             date.getMinutes() + ":" + date.getSeconds() + ".log";
    }

    /** 设置日志状态 */
    public static setLogStatus(flag: boolean): void {
        LogUtil._logStatus = flag;
        if (flag) {
            // 定时保存日志
            // setInterval(() => {
            //     LogUtil.save();
            // }, 1000 * 15);
        }
    }

}

// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.log = LogUtil.log;
(window as any).it.debug = LogUtil.debug;
(window as any).it.warn = LogUtil.warn;
(window as any).it.error = LogUtil.error;
(window as any).it.saveLog = LogUtil.save;
(window as any).it.setLogStatus = LogUtil.setLogStatus;
