import GameMediator from "../../../libs/mvc_ex/base/GameMediator";
import { ViewCfg } from "../../SceneCfg";
import FirstView from "./FirstView";


export default class FirstMediator extends GameMediator {

    public view: FirstView;
    
    public init(data?: any): void {
        // 此时view还没有初始化
    }    
    
    public viewDidAppear(): void {
        // view 初始化后可对view进行操作
        this.view.setData("99999");

        this.bindEvent(FirstView.OPEN_A, (str: string)=>{
            this.addView(ViewCfg.POP_A_VIEW);
        }, this);

        this.bindEvent(FirstView.OPEN_B, (str: string)=>{
            this.addView(ViewCfg.POP_B_VIEW);
        }, this);
    }

    public destroy(): void {

    }
 
}
