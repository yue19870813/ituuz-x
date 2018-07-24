/// <reference path="./../base/IDestory.ts" />
namespace itz {
    /**
     * Queue
     * @author ituuz
     * @since 2017.08.24
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
    export class Queue<T> {
        private _elements:Array<T> = null;

		public constructor() {
			this._elements = new Array<T>();
        }
        
        public push(ele:T):void {
            this._elements.push(ele);
        }

        public pop():T {
            return this._elements.shift();
        }

        public front():T {
            if (this._elements.length > 0) {
                return this._elements[0];
            }
            return null;
        }

        public back():T {
            if (this._elements.length > 0) {
                return this._elements[this._elements.length - 1];
            }
            return null;
        }

        public isEmpty():boolean {
            return (this._elements.length < 1);
        }

        public size():number {
            return this._elements.length;
        }

        public clear():void {
            this._elements.length = 0;
        }
    }
}