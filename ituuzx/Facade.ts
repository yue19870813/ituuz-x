/// <reference path = "./base/notify/Notification.ts" />
/// <reference path = "./base/model/ModelBase.ts" />
/// <reference path = "./util/Map.ts" />
/// <reference path = "./ext/Logger.ts" />
namespace itz {
	/**
	 * Framework facade
	 * @author ituuz
	 */
	export class Facade {

		private constructor() {

		}

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
         * @param {number}type notification type
         * @return {boolean}
         */
		public static hasNotifyType(type:number):boolean {
			return Notification.hasType(type);
		}

		/**
         * send notify
         * @param {number}type notification ID 
         * @param {Object}obj notification object
         */
		public static sendNotify(type:number, obj:any = null):void {
			Notification.send(type, obj)
		}

		//--------------------- Model -----------------------
		private static _modelList:Map<any, ModelBase> = new Map();

		/**
		 * regist model
		 * @param {any}clazz model key
		 * @param {ModelBase}model ModelBase instance 
		 */
		public static registModel(clazz:any, model:ModelBase):void {
			let isExist = this._modelList.contains(clazz);	
			if (!isExist) {
				model.init();
				this._modelList.put(clazz, model);
			} else {
				Logger.flog("The model of " + clazz + " has already exist!");
			}
		}

		/**
		 * remove model's regist
		 * @param {any}clazz model key
		 * @return {boolean} is removed
		 */
		public static unregistModel(clazz:any):boolean {
			return this._modelList.remove(clazz);
		}
	}
}