import { Facade } from "../libs/lightMVC/core/Facade";
import PlayerModel from "./model/PlayerModel";
import DefaultSceneMediator from "./view/DefaultSceneMediator";
import DefaultScene from "./view/DefaultScene";
import SceneCfg from "./SceneCfg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NativeScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start() {
        this.label.string = "first scene is a native scene.";
        // initialize mvc framework
        // Facade.getInstance().init(false, cc.size(1080, 2048), false, true);
        // 初始化框架
        it.Framework.start(SceneCfg.DEFAULT_SCENE, [
            PlayerModel
        ], false, cc.size(1080, 2048), false, true);
    }

    // 点击切换场景
    public onClick(): void {
        // run first mvc scene
        // Facade.getInstance().runScene(DefaultSceneMediator, DefaultScene, "测试参数999");
    }

}
