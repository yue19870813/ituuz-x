
import BaseLoader from "./BaseLoader";

export default class PrefabLoader extends BaseLoader {

    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载网络预制体资源
        throw new Error("PrefabLoader loadNetRes method not implemented.");
    }

    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载预制体资源
        throw new Error("PrefabLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }

}
