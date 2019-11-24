import LogUtil from "../../core/util/LogUtil";
import MessageBase from "./MessageBase";

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
		PBUtils.protobufjs.loadProtoFile = (filename: string, callback: (e: any, r: any) => void) => {
            cc.loader.loadRes(filename, cc.JsonAsset, (err: any, json: cc.JsonAsset) => {
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
    public static loadFile(filename: string, callback: (e:any, r: any) => void): void {
        PBUtils.protobufjs.loadProtoFile(filename, callback);
    }

    public static getArrayObjects(msg: any): any[] {
        let result = [];
        for (let b of msg) {
            result.push(b.getObject());
        }
        return result;
    }

    public static getArrayMessages<T extends MessageBase>(obj: any, cls: new() => T): T[] {
        let list: T[] = [];
        for (let arr of obj) {
            let msg = new cls();
            msg.setObject(arr);
            list.push(msg);
        }
        return list;
    }

    public static getMessage<T extends MessageBase>(obj: any, cls: new() => T): T {
        let msg = new cls();
        msg.setObject(obj);
        return msg;
    }
}