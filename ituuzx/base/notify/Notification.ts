/// <reference path = "./../../util/Map.ts" />
namespace itz {
    /**
     * Global notification send and subscrib tools.
     * @author ituuz
     * @since 2017.07.11
     */
    export class Notification {

        private static _callbackList:Map<number, Array<any>> = new Map();

        public constructor() {
            throw (new SimpleError("The itz.Notification can't call constructor!"));
        }

        /**
         * Message subscrib 
         * @param type message ID 
         * @param callback 
         * @param target 
         */
        public static subscrib(type:number, callback:Function, target:any = null):void {
            let isExist = this._callbackList.contains(type);
            if (isExist) {
                let arr = this._callbackList.get(type);
                arr.push([callback, target]);
            } else {
                let arrobj = new Array();
                arrobj.push([callback, target]);
                this._callbackList.put(type, arrobj);
            }
        }

        /**
         * unsubscrib
         * @param type message ID 
         * @param callback 
         * @return {boolean} is subscrib
         */
        public static unsubscrib(type:number, callback:Function):boolean {
            let isExist = this._callbackList.contains(type);
            if (isExist) {
                let arr = this._callbackList.get(type);
                let len = arr.length;
                for (let i = 0; i < len; i++) {
                    if (arr[i][0] == callback) {
                        arr.splice(i, 1);
                        return true;
                    }
                }
                return false;
            } 
            return false;
        }

        /**
         * Remove message by type
         * @param type message type
         * @return {boolean}
         */
        public static removebByType(type:number):boolean {
            let isExist = this._callbackList.contains(type);
            if (isExist) {
                return this._callbackList.remove(type);
            } 
            return false;
        }

        /**
         * To judge whether this type of message is registered
         * @param type message type
         * @return {boolean}
         */
        public static hasType(type:number):boolean {
            return this._callbackList.contains(type);
        }

        /**
         * remove all subscrib
         */
        public static removeAll():void {
            this._callbackList.clear();
        }
        
        /**
         * send message
         * @param type message ID 
         * @param obj message value
         */
        public static send(type:number, obj:any = null):void {
            let isExist = this._callbackList.contains(type);
            if (isExist) {
                let arr = this._callbackList.get(type);
                let len = arr.length;
                for (let i = 0; i < len; i++) {
                    let temp = arr[i];
                    if (temp) {
                        (temp[0] as Function).apply(temp[1], [obj, temp[1]]);
                    }
                }
            } 
        }
    }
}