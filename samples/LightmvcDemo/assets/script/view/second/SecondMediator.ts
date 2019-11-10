import PlayerModel from "../../model/PlayerModel";
import SecondView from "./SecondView";
import GameMediator from "../../../libs/mvc_ex/base/GameMediator";
import SceneCfg from "../../SceneCfg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SecondMediator extends GameMediator {

    public view: SecondView;

    public init(data?: any): void {
        
    }    
    
    public viewDidAppear(): void {
        this.bindEvent(SecondView.BACK_SCENE, ()=>{
            this.gotoScene(SceneCfg.DEFAULT_SCENE);
        }, this);
        let playerModel = this.getModel(PlayerModel);
        let lv = playerModel.getPlayerLv();
        this.view.setData(lv);
    }
    
    public destroy(): void {

    }

}
