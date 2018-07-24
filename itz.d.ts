/**
 * we often used utils
 */
declare namespace itz {
	/**
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
	class Map<K, V> {
		constructor();
		put(_key:K, _value:V):void;
		get(_key:K):V;
		remove(_key:K):boolean;
		contains(_key:K):boolean;
		getList():Array<any>;
		size():number;
		isEmpty():boolean;
		clear():void;
	}
	/**
     * Queue
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
	class Queue<T> {
		constructor();
		push(ele:T):void;
		pop():T;
		front():T;
		back():T;
		size():number;
		isEmpty():boolean;
		clear():void;
	}
	/**
     * Stack
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
	class Stack<T> {
		constructor();
		push(ele:T):void;
		pop():T;
		top():T;
		size():number;
		isEmpty():boolean;
		clear():void;
	}
}
/** 
 * The main namespace of the framework, all core classes, functions, properties and constants are defined in the namespace.
 */
declare namespace itz {	
	/** ituuz-x version */
	export var ITZ_VERSION:string;

	/** the destory interface */
	interface IDestory {
		dispose():void;
	}
	/** all error's base */
	class ErrorBase implements IDestory {
		/** the name of error */
		name:string;
		constructor(msg:string);
		dispose():void;
	}
	/** simple error */
	class SimpleError extends ErrorBase {
		/** the name of simple error */
		name:string;
		constructor(msg:string);
	}
	/** all the model are extends ModelBase */
	class ModelBase implements IDestory {
		constructor();
	    /**
         * The initialize function, it will be call init function when subclass overwrite the init function.
         * It's used to initialize some data or add listener after constructor.
         */
		init():void;
		/**
         * Send notification
         * @param type notification type 
         * @param obj notification value
         */
		send(type:number, obj:any):void;
		/**
		 * clear something
		 */
		clear():void;
		/**
         * Subclass must be override destory!
         * @throws when subclass not overwrite the function.
         */
		dispose():void;
	}
	class Logger {
		static log(obj:any, ...subst:any[]);
		static warn(obj:any, ...subst:any[]);
		static info(obj:any, ...subst:any[]);
		static error(obj:any, ...subst:any[]);
	}
	/** logger type */
	export enum LoggerType {
        NONE,
        ALL,
        INFO,
        LOG,
        WARN,
        ERROR
	}
	/**
	 * framework controller
	 */
	class Controller {
		/** get the controller instance */
		static getInstance():Controller;
		/** init some framework config */
		init(debug:boolean, appName?:string, logType?:LoggerType);
	}
	/** the facada of framework, many common API in it. */
	class Facade {
		/**
         * Notification subscrib 
         * @param type notification ID 
         * @param callback callback
         * @param target target
         */
		static registNotify(type:number, callback:Function, target:any):void;
		/**
         * Notification unsubscrib
         * @param type notification ID 
         * @param callback callback
         * @return {boolean} is unsubscrib success
         */
		static unregistNotify(type:number, callback:Function, target:any):boolean;
		/**
         * Remove notification by type
         * @param type notification type
         * @return {boolean} is remove success
         */
		static removebyNotifyByType(type:number):boolean;
		/**
         * remove all notification registed
         */
		static removeAllNotify():void;
		/**
         * To judge whether this type of notification is registed
         * @param {number}type notification type
         * @return {boolean}
         */
		static hasNotifyType(type:number):boolean;
		/**
         * send notify
         * @param {number}type notification ID 
         * @param {Object}obj notification object
         */
		static sendNotify(type:number, obj:any):void;
		/**
		 * regist model
		 * @param {any}clazz model key
		 * @param {ModelBase}model ModelBase instance 
		 */
		static registModel(clazz:any, model:ModelBase):void;
		/**
		 * remove model's regist
		 * @param {any}clazz model key
		 * @return {boolean} is removed
		 */
		static unregistModel(clazz:any):boolean;
		/**
		 * remove all model and destory them.
		 */
		static removeAllModel():void;
	}
	
}