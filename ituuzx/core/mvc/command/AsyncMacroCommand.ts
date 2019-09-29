/**
 * 异步组合宏命令基类
 * 该组合宏中的子命令是同步执行的，会按照添加的顺序同步执行。
 * @author ituuz
 */
import MacroCommand from "./MacroCommand";

export default abstract class AsyncMacroCommand extends MacroCommand {

    /**
     * 异步执行组合命令
     */
    private asyncExecute(): void {
        let cmdList = this["_commandList"];
        for (let cmd of cmdList) {
            let tempCmd = new cmd.cmd();
            tempCmd.execute(cmd.body);
        }
    }

    /**
     * 异步撤销组合命令
     */
    private asyncUndo(): void {
        let cmdList = this["_commandList"];
        for (let cmd of cmdList) {
            let tempCmd = new cmd.cmd();
            tempCmd.undo(cmd.body);
        }
    }
}