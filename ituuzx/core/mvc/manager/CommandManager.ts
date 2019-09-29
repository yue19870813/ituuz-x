/**
 * 命令控制类
 * @author ituuz
 * @description 负责控制和维护命令。
 */
import BaseCommand from "../base/BaseCommand";
import SimpleCommand from "../command/SimpleCommand";
import SyncMacroCommand from "../command/SyncMacroCommand";
import AsyncMacroCommand from "../command/AsyncMacroCommand";

export default class CommandManager {

    // 实例
    private static _instance: CommandManager = new CommandManager();

    /**
     * @constructor
     * @private
     */
    private constructor () {

    }

    /**
     * 单例获取类
     */
    public static getInstance(): CommandManager {
        return this._instance;
    }

    /**
     * 执行命令
     * @param {{new (): BaseCommand}} command 命令对象
     * @param {Object} body 命令参数
     */
    public __executeCommand__(command: {new (): BaseCommand}, body?: any): void {
        if (cc.js.isChildClassOf(command, SimpleCommand)) {
            let cmd: SimpleCommand = new command() as SimpleCommand;
            cmd.execute(body);
        } else if (cc.js.isChildClassOf(command, SyncMacroCommand)) {
            // TODO: 同步按顺序执行的命令组合宏
        } else if (cc.js.isChildClassOf(command, AsyncMacroCommand)) {
            let cmd: AsyncMacroCommand = new command() as AsyncMacroCommand;
            // 初始化宏
            cmd["initialize"]();
            // 执行
            cmd["asyncExecute"]();
        } else {
            console.log(command.prototype + " 不是可执行的命令！");
        }
    }

    /**
     * 撤销命令
     * @param {{new (): BaseCommand}} command 命令对象
     * @param {Object} body 命令参数
     */
    public __undoCommand__(command: {new (): BaseCommand}, body?: any): void {
        if (cc.js.isChildClassOf(command, SimpleCommand)) {
            let cmd: SimpleCommand = new command() as SimpleCommand;
            cmd.undo(body);
        } else if (cc.js.isChildClassOf(command, SyncMacroCommand)) {
            // TODO: 同步按顺序撤销的命令组合宏
        } else if (cc.js.isChildClassOf(command, AsyncMacroCommand)) {
            let cmd: AsyncMacroCommand = new command() as AsyncMacroCommand;
            // 初始化宏
            cmd["initialize"]();
            // 执行
            cmd["asyncUndo"]();
        } else {
            console.log(command.prototype + " 不是可执行的命令！");
        }
    }
}