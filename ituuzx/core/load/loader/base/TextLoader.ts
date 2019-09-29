
import BaseLoader from "./BaseLoader";

export default class TextLoader extends BaseLoader {
    
    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载网络文本资源
        throw new Error("TextLoader loadNetRes method not implemented.");
    }    
    
    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载文本资源
        throw new Error("TextLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }

    
}