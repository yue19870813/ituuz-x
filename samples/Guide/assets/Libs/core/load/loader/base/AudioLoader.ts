
import BaseLoader from "./BaseLoader";

export default class AudioLoader extends BaseLoader {

    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载网络图集资源
        throw new Error("AtlasLoader loadNetRes method not implemented.");
    }

    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载图集资源
        throw new Error("AtlasLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }

}
