/**
 * 资源加载基类，负责处理资源加载逻辑（本地/远程下载/网络动态资源）
 * @author ituuz
 */
export default abstract class BaseLoader {
    
    /**
     * 资源统一加载接口
     * @param {string} path 资源路径
     * @param {cc.Asset} type 资源类型
     * @param {(err, res) => void} callback 加载完成回调
     */
    public loadRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void {
        if (path.startsWith("http") || path.startsWith("https")) {
            // 加载网络资源
            this.loadNetRes(path, type, callback);
        } else {
            if (this.isRemoteRes(path)) {
                // 加载远程待下载资源
                this.loadRemoteRes(path, type, callback);
            } else {
                // 加载本地资源
                this.loadLocalRes(path, type, callback);
            }
        }
    }

    // 加载网络资源
    public abstract loadNetRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void;
    // 加载远程待下载资源
    public abstract loadRemoteRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void;
    // 加载本地资源
    public abstract loadLocalRes(path: string, type: typeof cc.Asset, callback: (err, res) => void): void;

    /**
     * 判断是否是远程待下载资源
     * @param {string} path 资源路径 
     */
    public isRemoteRes(path: string): boolean {
        // TODO 判断是否是远程待下载资源，后续定义规则
        return false;
    }
}