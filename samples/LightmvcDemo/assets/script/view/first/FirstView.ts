import GameView from "../../../libs/mvc_ex/base/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FirstView extends GameView {

    // onLoad () {}
    public static readonly OPEN_A = "OPEN_A";

    public static readonly OPEN_B = "OPEN_B";


    start () {

        let aBtnNode = this.ui.getNode("a_btn");
        aBtnNode.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.sendEvent(FirstView.OPEN_A, "AAA");
        }, this);

        let bBtnNode = this.ui.getNode("b_btn");
        bBtnNode.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.sendEvent(FirstView.OPEN_B, "BBB");
        }, this);

        let closeBtnNode = this.ui.getNode("close_btn");
        closeBtnNode.on(cc.Node.EventType.TOUCH_END, this.closeAllView, this);
    }

    public setData(str: string): void {
        let desLabel = this.ui.getComponent("des_label", cc.Label);
        desLabel.string = "这是第一个UI，根据prefab创建，打开场景时传入的参数是：" + str;
    }

    public closeAllView(): void {
        this.closeAllPopView();
    }

    public static path(): string {
        return "prefabs/first_view";
    }

}
