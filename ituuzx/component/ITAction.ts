/**
 * 播放动作的脚本
 * @author ituuz
 * 动作类型见下面枚举 { ActionType }
 */

// 动作枚举
// tslint:disable-next-line: variable-name
export let ActionType = cc.Enum({
    NONE : 0,               // 无动画
    UP_AND_DOWN : 1,        // 上下晃动的动画
    MOVE_AND_OUT : 2        // 移动并消失动画
});

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@menu("IT Component/ITAction")
@executeInEditMode
export default class ITAction extends cc.Component {

    @property({
    })
    private _type: number = ActionType.NONE;
    @property({
        type: ActionType,
        tooltip: "播放的动画类型"
    })
    get type(): number {
        return this._type;
    }
    set type(t) {
        this._type = t;
        this._refreshPropertyPanel();
    }

    @property({
        type: cc.Integer,
        visible() { return this._timeVisible; }
    })
    public time: number = 200;

    @property({
        visible() { return this._posVisible; }
    })
    public pos: cc.Vec2 = cc.v2(0, 0);


    @property({
    })
    private _cb: cc.Component.EventHandler = null;
    @property({
        type: cc.Component.EventHandler,
        visible() { return this._eventVisible; }
    })
    get event(): cc.Component.EventHandler {
        return this._cb;
    }
    set event(cb) {
        this._cb = cb;
    }

    ////////////////////////////////////////////
    private _timeVisible = false;
    private _posVisible = false;
    private _eventVisible = false;

    public start() {
        this._refreshPropertyPanel();
        switch (this.type) {
            case ActionType.UP_AND_DOWN:
                this.playUpAndDown();
                break;
            case ActionType.MOVE_AND_OUT:
                this.moveAndOut();
                break;
        }
    }

    // 上下晃动的动画
    public playUpAndDown() {
        let up = cc.moveBy(this.time / 1000, cc.v2(0, this.pos.y));
        let down = cc.moveBy(this.time / 1000, cc.v2(0, -this.pos.y));
        let seq = cc.repeatForever(
            cc.sequence(
                up,
                down,
                down,
                up
            ));
        this.node.runAction(seq);
    }

    // 移动然后消失 
    public moveAndOut() {
        let move = cc.moveBy(this.time, cc.v2(0, 50));
        let out = cc.fadeOut(this.time);
        let cb = cc.callFunc(() => {
            if (this._cb && this._cb.handler !== "") {
                this._cb.emit([this._cb.customEventData]);
            } else {
                this.node.destroy();
            }
        });
        let spawn = cc.spawn(move, out);
        let seq = cc.sequence(spawn, cb);
        this.node.runAction(seq);
    }

    public _refreshPropertyPanel() {
        if (this.type === ActionType.UP_AND_DOWN) {
            this._timeVisible = true;
            this._posVisible = true;
        } else if (this.type === ActionType.MOVE_AND_OUT) {
            this._timeVisible = true;
            this._posVisible = true;
            this._eventVisible = true;
        } else {
            this._timeVisible = false;
        }
    }
}
