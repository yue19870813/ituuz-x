/** 
 * The main namespace of the framework, all core classes, functions, properties and constants are defined in the namespace.
 */
declare module cc {	
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
}