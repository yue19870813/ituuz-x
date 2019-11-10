import PopAView from "./PopAView";
import PlayerModel from "../../model/PlayerModel";
import { UpdateExpCommand } from "../../command/PlayerCommand";
import Notification from "../../Notification";
import GameMediator from "../../../libs/mvc_ex/base/GameMediator";

export default class PopAMediator extends GameMediator {

    public view: PopAView;

    public init(data?: any): void {
        
    }    
    
    public viewDidAppear(): void {
        this.view.drawView("999");

        let playerModel = this.getModel(PlayerModel);
        this.view.setLevelDisplay(playerModel.getPlayerLv());

        // 监听修改经验事件
        this.bindEvent(PopAView.UPDATE_LEVEL, (exp)=>{
            this.sendCmd(UpdateExpCommand, exp);
        }, this);

        this.registerNoti(Notification.UPDATE_EXP_FINISH, ()=>{
            this.view.setLevelDisplay(playerModel.getPlayerLv());
        }, this);
    }
    
    public destroy(): void {

    }



}
