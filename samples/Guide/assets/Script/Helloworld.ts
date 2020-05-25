import { SceneCfg } from "./SceneCfg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    start () {
        // init logic
        it.Framework.start(SceneCfg.GUIDE_SCENE, []);
    }
}
