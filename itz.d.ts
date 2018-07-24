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
	/**
     * Global notification send and subscrib tools.
     */
	class Notification {
		static _callbackList:Map<number, Array<any>>;
	}
}