import { MVC_scene, MVC_struct } from "../Libs/Framework";

// UI配置
export class ViewCfg {

}

// 场景配置
export class SceneCfg {

    /** 引导主场景 */
    public static readonly GUIDE_SCENE: MVC_scene = {
        medClass: "GuideScMediator",
        viewClass: "GuideScView",
        children: [
            {
                medClass: "GuideListMediator",
                viewClass: "GuideListView",
                children: []
            }
        ]
    }
}