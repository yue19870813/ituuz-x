/// <reference path="./../IDestory.ts" />
/// <reference path="./../error/SimpleError.ts" />
namespace itz {
    /**
     * The data model superclass,include init,send,clear and destory functions.
     * @author ituuz
     * @since 2017.07.12
     */
    export class ModelBase implements IDestory {
        public constructor () {
            
        }

        /**
         * The initialize function, it will be call init function when subclass overwrite the init function.
         * It's used to initialize some data or add listener after constructor.
         */
        public init():void {
            
        }

        /**
         * Send notification
         * @param type notification type 
         * @param obj notification value
         */
        public send(type:number, obj:any):void {
            // _Notification_.send(type, obj);
        }

        /**
         * 
         */
        public clear():void {
            
        }

        /**
         * Subclass must be override destory!
         * @throws when subclass not overwrite the function.
         */
        public dispose():void {
            throw(new SimpleError("Subclass must be override destory!"));
        }
    }
}