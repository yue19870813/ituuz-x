import LogUtil from "../../core/util/LogUtil";

/**
 * 处理pb相关接口工具类
 * @author ituuz
 */
export default class PBUtils {
    // pb对象
    private static protobufjs: any;
    /** 工具初始化接口 */
    public static init() {
        PBUtils.protobufjs = require("protobufjs");
        // 此方法是将ProtoBuf.Util.fetch函数替换成cc.loader.loadRes函数，以解决在微信小游戏中不能使用XHR的问题
		PBUtils.protobufjs.loadProtoFile = (filename: string, callback: (e, r) => void) => {
            cc.loader.loadRes(filename, cc.JsonAsset, (err, json) => {
                if (err) {
                    LogUtil.warn(filename + "is not exist!");
                    return;
                } 
                let root = PBUtils.protobufjs.Root.fromJSON(json.json);
                callback(err, root);
            });
        };
    }

    /** 加载指定的pb文件 */
    public static loadFile(filename: string, callback: (e, r) => void): void {
        PBUtils.protobufjs.loadProtoFile(filename, callback);
    }
}