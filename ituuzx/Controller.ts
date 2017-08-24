/// <reference path="./base/IDestory.ts" />
namespace itz {
    export class Controller {
    
        private static _instance:Controller;

        private _debug:boolean;
        private _logType:LoggerType;

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
    }
}