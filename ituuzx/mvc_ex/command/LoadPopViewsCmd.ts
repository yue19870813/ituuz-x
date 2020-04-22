import SimpleCommand from "../../core/mvc/command/SimpleCommand";
import PopViewManager from "../manager/PopViewManager";

/**
 * 根据配置加载场景或者view的命令。
 * @author ituuz
 */
export default class LoadPopViewsCmd extends SimpleCommand {

    public execute(body?: any): void {
        let option = body.option;
        let immediate = false;
        if (option) {
            immediate = option.immediate;
        }
        if (immediate) {
            // 立即弹出界面，没有时间间隔
            PopViewManager.popViewImmediate([body.mvc], body.data, body.parent, body.useCache);
        } else {
            // 调用弹出view, 此接口同时只支持弹出一个界面，有500毫秒间隔
            PopViewManager.popView([body.mvc], body.data, body.parent, body.useCache);
        }
    }

    public undo(body?: any): void {
        throw new Error("Method not implemented.");
    }
}
