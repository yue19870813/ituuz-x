import Notification from "../Notification";
import BaseModel from "../../libs/core/mvc/base/BaseModel";

export default class PlayerModel extends BaseModel {
    
    private _player: Player;

    public init(): void {
        this._player = new Player("Spider man");
    }    

    public setPlayerExp(exp: number): void {
        this._player.exp = this._player.exp + exp;

        this.sendNoti(Notification.UPDATE_EXP_FINISH);
    }

    public getPlayer(): Player {
        return this._player;
    }

    public getPlayerLv(): number {
        return Math.ceil(this._player.exp / 10);
    }
    
    public clear(): void {

    }
}

export class Player {
    public name: string;
    public exp: number;

    public constructor (name: string, exp?: number) {
        this.name = name;
        if (exp) {
            this.exp = exp;
        } else {
            this.exp = 0;
        }
    }
}
