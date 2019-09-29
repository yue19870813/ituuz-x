
import BaseLoader from "./BaseLoader";

export default class ImageLoader extends BaseLoader {
    
    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载网络图片资源
        throw new Error("ImageLoader loadNetRes method not implemented.");
    }    
    
    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载图片资源
        throw new Error("ImageLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }

    
}