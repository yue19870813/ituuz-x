/// <reference path="./base/IDestory.ts" />
namespace itz {
    export class Controller {
    
        private static _instance:Controller;

        /** Debug */
        private _debug:boolean;
        /** log type, please see the LoggerType enum in Logger.ts */
        private _logType:LoggerType;
        /** log name, it will be print in the log. */
        private _logName:string;

        private constructor() {

        }

        public static getInstance():Controller {
            if (this._instance == null) {
                this._instance = new Controller();
            }
            return this._instance;
        }

        public init(debug:boolean = false, logType:LoggerType = LoggerType.ALL) {
            this._debug = debug;
            this._logType = logType;
        }

        public getLogType():LoggerType {
            return this._logType;
        }

        public getDebug():boolean {
            return this._debug;
        }

        public setLogName(name:string = "ituuz") {
            this._logName = name;
        }

        public getLogName():string {
            return this._logName;
        }
    }
}