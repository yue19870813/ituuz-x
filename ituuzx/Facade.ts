/// <reference path = "./base/notify/Notification.ts" />
namespace itz {
	/**
	 * Framework facade
	 * @author ituuz
	 */
	export class Facade {

		//--------------------- Notification -----------------------
		/**
         * Notification subscrib 
         * @param type notification ID 
         * @param callback callback
         * @param target target
         */
		public static registNotify(type:number, callback:Function, target:any = null):void {
			Notification.subscrib(type, callback, target);
		}

		/**
         * Notification unsubscrib
         * @param type notification ID 
         * @param callback callback
         * @return {boolean} is unsubscrib success
         */
		public static unregistNotify(type:number, callback:Function, target:any = null):boolean {
			return Notification.unsubscrib(type, callback);
		}

		/**
         * Remove notification by type
         * @param type notification type
         * @return {boolean} is remove success
         */
		public static removebyNotifyByType(type:number):boolean {
			return Notification.removebByType(type);
		}

		/**
         * remove all notification registed
         */
		public static removeAllNotify():void {
			Notification.removeAll();
		}

		/**
         * To judge whether this type of notification is registed
         * @param type notification type
         * @return {boolean}
         */
		public static hasNotifyType(type:number):boolean {
			return Notification.hasType(type);
		}

		/**
         * send notify
         * @param type notification ID 
         * @param obj notification object
         */
		public static sendNotify(type:number, obj:any = null):void {
			Notification.send(type, obj)
		}

		//--------------------- Model -----------------------
		
	}
}