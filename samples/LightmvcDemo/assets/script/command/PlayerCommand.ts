import SimpleCommand from "../../libs/lightMVC/core/command/SimpleCommand";
import PlayerModel from "../model/PlayerModel";

/**
 * 更新经验命令
 */
export class UpdateExpCommand extends SimpleCommand {

    public execute(body?: any): void {
        let model = this.getModel(PlayerModel);
        model.setPlayerExp(Number(body));
    }    
    
    public undo(body?: any): void {
        let model = this.getModel(PlayerModel);
        let player = model.getPlayer();
        player.exp = player.exp - Number(body);
    }
    
}