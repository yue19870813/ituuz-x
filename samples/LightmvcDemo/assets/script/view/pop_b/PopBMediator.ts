import PopBView from "./PopBView";
import GameMediator from "../../../libs/mvc_ex/base/GameMediator";
import SceneCfg from "../../SceneCfg";

export default class PopBMediator extends GameMediator {

    public view: PopBView;

    public init(data?: any): void {
        
    }     
    
    public viewDidAppear(): void {
        this.view.drawView("888");
        this.bindEvent(PopBView.RUN_SECOND_SCENE, ()=>{
            this.gotoScene(SceneCfg.SECOND_SCENE);
        }, this);
    }
    
    public destroy(): void {

    }



}
