import FirstMediator from "./first/FirstMediator";
import FirstView from "./first/FirstView";
import GameMediator from "../../libs/mvc_ex/base/GameMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DefaultSceneMediator extends GameMediator {

    private _data: any;
    
    public init(data?: any): void {
        console.log("打开场景时传递的参数:", data);
        this._data = data;
    }    
    
    public viewDidAppear(): void {
        console.log("viewDidAppear ===>>>", this._data);
        // 打开第一个UI
        // this.addLayer(FirstMediator, FirstView, 1, this._data);
    }

    public destroy(): void {

    }

}
