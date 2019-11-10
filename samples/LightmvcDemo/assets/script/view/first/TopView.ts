import GameView from "../../../libs/mvc_ex/base/GameView";

export default class TopView extends GameView {

    public init() {
        console.log("init");
    }

    start () {

    }

    public static path(): string {
        return "prefabs/top_view";
    }
}