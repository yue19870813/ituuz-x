import { MVC_struct } from "../libs/Framework";

export default class SceneCfg {

    public static readonly DEFAULT_SCENE: MVC_struct = {
        viewClass: "DefaultScene",
        medClass: "DefaultSceneMediator",
        children: [
            {
                viewClass: "TopView",
                medClass: "TopMediator",
                children: []
            },
            {
                viewClass: "FirstView",
                medClass: "FirstMediator",
                children: []
            }
        ]
    }

    public static readonly SECOND_SCENE: MVC_struct = {
        viewClass: "SecondScene",
        medClass: "SecondSceneMediator",
        children: [
            {
                viewClass: "SecondView",
                medClass: "SecondMediator",
                children: []
            }
        ]
    }
}

export class ViewCfg {
    public static readonly POP_A_VIEW: MVC_struct = {
        viewClass: "PopAView",
        medClass: "PopAMediator",
        children: []
    }

    public static readonly POP_B_VIEW: MVC_struct = {
        viewClass: "PopBView",
        medClass: "PopBMediator",
        children: []
    }
}