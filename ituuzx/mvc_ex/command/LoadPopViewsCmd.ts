import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import { Facade } from "../../core/mvc/Facade";
import JSUtil from "../../core/util/JSUtil";
import { MVC_struct } from "../../Framework";

/**
 * 根据配置加载场景或者view的命令。
 * @author ituuz
 */
export default class LoadPopViewsCmd extends SimpleCommand {

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }

    public execute(body?: any): void {
        // 增加参数传递逻辑
        this.loadViews([body.mvc], body.data);
    }

    /** 根据配置数据加载view */
    private loadViews(views: MVC_struct[], data: any = null): void {
        if (views && views.length > 0) {
            // 遍历节点数组创建layer
            for (let i = 0; i < views.length; i++) {
                let mvcObj = views[i];
                let viewModule = null;
                JSUtil.importCls(mvcObj.viewClass).then((module) => {
                    viewModule = module;
                    return JSUtil.importCls(mvcObj.medClass);
                }).then((medModule) => {
                    Facade.getInstance().popView(medModule, viewModule, data, () => {
                        // 加载完成后的回调,递归加载childern
                        if (mvcObj.children && mvcObj.children.length > 0) {
                            this.loadViews(mvcObj.children, null);
                        }
                    });
                });
            }
        }
    }
    
}
