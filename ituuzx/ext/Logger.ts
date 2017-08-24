/// <reference path="./../base/IDestory.ts" />
/// <reference path="./../Controller.ts" />
namespace itz {
    // *****************************************************************************
    // This file include two class, one is Logger tools and the other is LoggerType
    // *****************************************************************************
    /**
     * @author ituuz
     * @since 2017.08.24
     */
    export class Logger {
        
        public static log(obj:any, ...subst:any[]) {
            if (Controller.getInstance().getLogType() == LoggerType.LOG
                || Controller.getInstance().getLogType() == LoggerType.ALL) {
                console.log("[Dee log]：" + obj, ...subst);
            }
        }

        public static warn(obj:any, ...subst:any[]) {
            if (Controller.getInstance().getLogType() == LoggerType.WARN
                || Controller.getInstance().getLogType() == LoggerType.ALL) {
                console.warn("[Dee log]：" + obj, ...subst);
            }
        }

        public static info(obj:any, ...subst:any[]) {
            if (Controller.getInstance().getLogType() == LoggerType.INFO
                || Controller.getInstance().getLogType() == LoggerType.ALL) {
                console.info("[Dee log]：" + obj, ...subst);
            }
        }

        public static error(obj:any, ...subst:any[]) {
            if (Controller.getInstance().getLogType() == LoggerType.ERROR
                || Controller.getInstance().getLogType() == LoggerType.ALL) {
                console.error("[Dee log]：" + obj, ...subst);
            }
        }
    }
    // *************************************************************************
    // Log type
    // *************************************************************************
    export enum LoggerType {
        NONE,
        ALL,
        INFO,
        LOG,
        WARN,
        ERROR
    }
}