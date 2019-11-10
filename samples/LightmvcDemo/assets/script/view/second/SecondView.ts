import GameView from "../../../libs/mvc_ex/base/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SecondView extends GameView {

    public static readonly BACK_SCENE = "BACK_SCENE";

    public init(): void {
        let backBtn = this.ui.getNode("back_btn");
        backBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            // 返回上一场景
            this.sendEvent(SecondView.BACK_SCENE);
        }, this);
    }

    public setData(lv: number): void {
        let lvLabel = this.ui.getComponent("lv_label", cc.Label);
        lvLabel.string = "当前等级为：" + lv;
    }

    public static path(): string {
        return "prefabs/second_view";
    }

}
