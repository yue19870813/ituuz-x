import SecondMediator from "./second/SecondMediator";
import SecondView from "./second/SecondView";
import GameMediator from "../../libs/mvc_ex/base/GameMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SecondSceneMediator extends GameMediator {

    public init(data?: any): void {
        console.log("打开场景SecondSceneMediator");
    }    
    
    public viewDidAppear(): void {
        // 打开第二个UI
        // this.addLayer(SecondMediator, SecondView, 1);
    }

    public destroy(): void {

    }

}
