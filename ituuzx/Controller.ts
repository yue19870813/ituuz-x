/// <reference path="./base/IDestory.ts" />
namespace itz {
    export class Controller {
    
        private static _instance:Controller;

        /** Debug */
        private _debug:boolean;
        /** log type, please see the LoggerType enum in Logger.ts */
        private _logType:LoggerType;
        /** log name, it will be print in the log. */
        private _logName:string = "itz";

        private constructor() {

        }

        public static getInstance():Controller {
            if (this._instance == null) {
                this._instance = new Controller();
            }
            return this._instance;
        }

        public init(debug:boolean = false, appName?:string, logType?:LoggerType) {
            this._debug = debug;
            if (appName) {
                this._logName = appName;
            } 
            if (logType) {
                this._logType = logType;
            } else {
                this._logType = LoggerType.ALL;
            }
        }

        public getLogType():LoggerType {
            return this._logType;
        }

        public getDebug():boolean {
            return this._debug;
        }

        public getLogName():string {
            return this._logName;
        }
    }
}