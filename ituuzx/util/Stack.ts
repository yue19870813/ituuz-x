/// <reference path="./../base/IDestory.ts" />
namespace itz {
    /**
     * Stack
     * @author ituuz
     * @since 2017.08.24
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
    export class Stack<T> {
        private _elements:Array<T> = null;

		public constructor() {
			this._elements = new Array<T>();
        }
        
        public push(ele:T):void {
            this._elements.push(ele);
        }

        public pop():T {
            return this._elements.pop();
        }

        public top():T {
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