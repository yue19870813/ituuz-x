import BaseCommand from "../base/BaseCommand";
import SimpleCommand from "./SimpleCommand";

/**
 * 组合类型命令基类
 * @author ituuz
 */
export default abstract class MacroCommand extends BaseCommand {

    /** 组合命令列表 */
    private _commandList: {cmd: new () => SimpleCommand, body: any}[] = [];

    /**
     * 初始化组合命令接口，子类必须实现，用于组合命令。
     * @example
     *      this.addSubCommand(Test1Command);
     *      this.addSubCommand(Test2Command);
     */
    protected abstract initialize(): void;

    /**
     * 向组合宏中添加子命令
     * @param {{new (): SimpleCommand}} command 子命令
     * @param {Object} body 命令参数
     */
    public addSubCommand(command: new () => SimpleCommand, body?: any): void {
        this._commandList.push({cmd: command, body});
    }
}