/**
 * 自动适配组件
 * @author ituuz
 * @description 目前支持等比缩放适配、刘海屏适配
 */
import FrameworkCfg from "../FrameworkCfg";

// 动作枚举
// tslint:disable-next-line: variable-name
export let AdapterType = cc.Enum({
    NONE : 0,               // 无适配
    SHOW_ALL_NO_SCALE : 1,  // 等比缩放显示全部
    FIX_HEAD_SAFE : 2       // 适配刘海屏幕
});

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("IT Component/ITAdapter")
export default class ITAdapter extends cc.Component {

    @property({
        type: AdapterType,
        tooltip: "适配方式"
    })
    public type: number = 0;

    public onLoad() {
        if (this.type === AdapterType.SHOW_ALL_NO_SCALE) {
            // 标准适配分辨率系数
            let standardFactor = FrameworkCfg.DESIGN_RESOLUTION.width / FrameworkCfg.DESIGN_RESOLUTION.height;
            // 当前设备分辨率系数
            let curFactor = cc.winSize.width / cc.winSize.height;
            if (curFactor > standardFactor) {
                this.node.scaleY = cc.winSize.height / FrameworkCfg.DESIGN_RESOLUTION.height;
                this.node.scaleX = cc.winSize.height / FrameworkCfg.DESIGN_RESOLUTION.height;
            } else if (curFactor < standardFactor) {
                this.node.scaleX = cc.winSize.width / FrameworkCfg.DESIGN_RESOLUTION.width;
                this.node.scaleY = cc.winSize.width / FrameworkCfg.DESIGN_RESOLUTION.width;
            }
        } else if (this.type === AdapterType.FIX_HEAD_SAFE) {
            // 刘海屏幕适配需要修改该组件的坐标，如果有Widget组件则修改Widget组件属性
            let winSize = cc.winSize;
            let safeAreaRect = cc.sys.getSafeAreaRect();
            let safeHeight = Math.ceil(winSize.height - safeAreaRect.height) / 2 + 24;
            let widget = this.getComponent(cc.Widget);
            if (widget) {
                widget.top = widget.top + (safeHeight / 2);
                widget.updateAlignment();
            } else {
                this.node.y = -safeHeight / 2;
            }
        }
    }

    public start() {
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}
