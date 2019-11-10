import GameView from "../../../libs/mvc_ex/base/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopBView extends GameView {

    public static readonly RUN_SECOND_SCENE = "RUN_SECOND_SCENE";

    public drawView (param: string): void {
        let closeBtn = this.ui.getNode("close_button");
        closeBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.closeView();
        }, this);

        let titleLabel = this.ui.getComponent("title_label", cc.Label);
        titleLabel.string = "传入的参数为：" + param;

        let runBtn = this.ui.getNode("run_btn");
        runBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.sendEvent(PopBView.RUN_SECOND_SCENE);
        }, this);
    }

    public static path(): string {
        return "prefabs/pop_b";
    }
}
