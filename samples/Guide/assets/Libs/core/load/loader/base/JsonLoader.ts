
import BaseLoader from "./BaseLoader";

export default class JsonLoader extends BaseLoader {

    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载网络Json资源
        throw new Error("JsonLoader loadNetRes method not implemented.");
    }

    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载Json资源
        throw new Error("JsonLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }

}
