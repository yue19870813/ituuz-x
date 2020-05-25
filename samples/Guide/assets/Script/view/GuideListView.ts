import GameView from "../../Libs/mvc_ex/base/GameView";
import { GuideListConfig } from "../GuideListConfig";

export default class GuideListView extends GameView {

    public static readonly GO_TO_GUIDE_CASE = "GO_TO_GUIDE_CASE";

    public onShow(): void {
        this.startDraw();
    }

    public async startDraw() {
        let container = this.ui.getNode("content");
        for (let d of GuideListConfig.data) {
            let title = d.title;
            let titleItem = await it.loader.loadPrefab("prefab/guide/guide_item_prefab");
            titleItem.getChildByName("label").getComponent(cc.Label).string = title;
            titleItem.color = cc.Color.BLUE;
            container.addChild(titleItem);
            for (let item of d.children) {
                let iItem = await it.loader.loadPrefab("prefab/guide/guide_item_prefab");
                iItem.getChildByName("label").getComponent(cc.Label).string = item.name;
                iItem.color = cc.Color.GRAY;
                container.addChild(iItem);
                iItem.on(cc.Node.EventType.TOUCH_END, () => {
                    this.sendEvent(GuideListView.GO_TO_GUIDE_CASE, item.view);
                }, this);
            }
        }
    }

    public static path(): string {
        return "prefab/guide/guide_list_prefab";
    }
}