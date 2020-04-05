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
        // @ts-ignore
        PBUtils.protobufjs = require("protobufjs");
        // 此方法是将ProtoBuf.Util.fetch函数替换成cc.loader.loadRes函数，以解决在微信小游戏中不能使用XHR的问题
        PBUtils.protobufjs.loadProtoFile = (filename: string, callback: (e: any, r: any) => void) => {
            it.loader.loadRes(filename, cc.JsonAsset, (err, json) => {
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

    public static getArrayObjects(msg: any): any[] {
        let result = [];
        for (let b of msg) {
            result.push(b.getObject());
        }
        return result;
    }

    /** 获取message对象数组 */
    public static getArrayMessages<T extends MessageBase>(obj: any, cls: new() => T): T[] {
        if (obj) {
            let list: T[] = [];
            for (let arr of obj) {
                let msg = new cls();
                msg.setObject(arr);
                list.push(msg);
            }
            return list;
        }
        return null;
    }

    /** 获取messge对象 */
    public static getMessage<T extends MessageBase>(obj: any, cls: new() => T): T {
        if (obj) {
            let msg = new cls();
            msg.setObject(obj);
            return msg;
        }
        return null;
    }

    // TODO 其他类型map，优化为范型
    /** 将pb对象转成Map */
    public static getMapMessage(obj: any): Map<number, number> {
        let map = new Map();
        // tslint:disable-next-line: forin
        for (let key in obj) {
            map.set(Number(key), Number(obj[key]));
        }
        return map;
    }
}
