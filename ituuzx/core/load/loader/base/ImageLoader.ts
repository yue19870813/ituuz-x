
import BaseLoader from "./BaseLoader";

export default class ImageLoader extends BaseLoader {

    public loadNetRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // 加载网络图片资源
        cc.loader.load({url: path, type: "png"}, (e, tex) => {
            if (e) {
                it.error(e);
            }
            if (callback) { callback(e, new cc.SpriteFrame(tex)); }
		});
    }

    public loadRemoteRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        // TODO 加载远程待下载图片资源
        throw new Error("ImageLoader loadRemoteRes method not implemented.");
    }

    public loadLocalRes(path: string, type: any, callback: (err: any, res: any) => void): void {
        cc.loader.loadRes(path, type, callback);
    }
}
