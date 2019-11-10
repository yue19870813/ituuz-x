import GameMediator from "../../../libs/mvc_ex/base/GameMediator";
import { ViewCfg } from "../../SceneCfg";
import FirstView from "./FirstView";


export default class FirstMediator extends GameMediator {

    public view: FirstView;
    
    public init(data?: any): void {
        // 此时view还没有初始化
    }    
    
    public viewDidAppear(): void {
        let myName = this.sceneContent.data.myName;
        // view 初始化后可对view进行操作
        this.view.setData(myName);

        this.bindEvent(FirstView.OPEN_A, (str: string)=>{
            // 打开新界面，并且设置其父节点为：this.view.node
            // this.addView(ViewCfg.POP_A_VIEW, null, this.view.node);
            // 默认层级
            this.addView(ViewCfg.POP_A_VIEW);
        }, this);

        this.bindEvent(FirstView.OPEN_B, (str: string)=>{
            // 打开界面B，并且设置第四个参数为true，意思是其节点复用，只会存在一个实例，而上面的界面B会存在多个实例
            this.addView(ViewCfg.POP_B_VIEW, null, null, true);
        }, this);
    }

    public destroy(): void {

    }
 
}
