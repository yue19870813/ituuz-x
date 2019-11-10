import GameView from "../../../libs/mvc_ex/base/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopAView extends GameView {

    public static readonly UPDATE_LEVEL = "UPDATE_LEVEL";

    public drawView (param: string): void {
        // 关闭按钮
        let closeBtn = this.ui.getNode("close_button");
        closeBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.closeView();
        }, this);

        // this.ui.addClickEvent(closeBtn, cc.Node.EventType.TOUCH_END, "close");
        // this.ui.addClickEvent("close_button", cc.Node.EventType.TOUCH_END, "close");

        // 显示传入参数的label
        let titleLabel = this.ui.getComponent("title_label", cc.Label);
        titleLabel.string = "传入的参数为：" + param;

        // 修改等级按钮
        let okBtn = this.ui.getNode("ok_btn");
        okBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            // 获取输入框填写的经验
            let expEditBox = this.ui.getComponent("exp_edit_box", cc.EditBox);
            this.sendEvent(PopAView.UPDATE_LEVEL, expEditBox.string);
        }, this);
    }

    public setLevelDisplay(lv: number): void {
        let levelLabel = this.ui.getComponent("des_label", cc.Label);
        levelLabel.string = "当前等级为：" + lv;
    }

    public static path(): string {
        return "prefabs/pop_a";
    }
}
