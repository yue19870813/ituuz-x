/// <reference path="./ErrorBase.ts" />
namespace itz {
	/**
	 * Simple exception
	 * @author ituuz
	 * @since 2017.07.11
	 */
	export class SimpleError extends ErrorBase {
		public name:string = "itz.SimpleError";
		public constructor(msg:string) {
			super(msg);
		}
	}
}
