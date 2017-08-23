/// <reference path="./../base/IDestory.ts" />
namespace itz {
    /**
     * @author ituuz
     * @since 2017.07.12
     * Notice:It's not fit for find in big data, because it's use Array implementation. Need algorithm to optimize.
     */
    export class Map<K, V> {

        private _elements:Array<any> = null;

		public constructor() {
			this._elements = new Array<any>();
		}

		public put(_key:K, _value:V):void {
			let isExist = this.contains(_key);
			if (isExist) {
				this.remove(_key);
			}
			this._elements.push( {
				key : _key,
				value : _value
			});
		}

		public get(_key:K):V {
			try {
				let len = this._elements.length;
				for (let i = 0; i < len; i++) {
					if (this._elements[i].key == _key) {
						return this._elements[i].value;
					}
				}
			} catch (error) {
				console.warn(error.name + ":[" + _key + "]not exist");
				return null;
			}
		}

		public remove(_key:K):boolean {
			try {
				let len = this._elements.length;
				for (let i = 0; i < len; i++) {
					if (this._elements[i].key == _key) {
						this._elements.splice(i, 1);
						return true;
					}
				}
			} catch (error) {
				console.warn(error.name + ":[" + _key + "]not exist");
				return false;
			}
			return false;
		}

		public contains(_key:K):boolean {
			try {
				let len = this._elements.length;
				for (let i = 0; i < len; i++) {
					if (this._elements[i].key == _key) {
						return true;
					}
				}
			} catch (error) {
				console.warn(error.name + ":[" + _key + "]not exist");
				return false;
			}
			return false;
		}

		public getList():Array<any> {
			return this._elements;
		}

		public size():number {
			return this._elements.length;
		}

		public isEmpty():boolean {
			return (this._elements.length < 1);
		}

		public clear():void {
			this._elements = new Array();
		}
    }
}
