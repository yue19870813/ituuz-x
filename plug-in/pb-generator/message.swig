import MessageBase from "../../../libs/extension/net/MessageBase";
import PBUtils from "../../../libs/extension/net/PBUtils";
{% for imp in imports %}{% if imp %} 
import {{ imp.name }} from "./{{ imp.url }}";{% endif %}{% endfor %}
/**
 * {{ clsName }}Message.ts
 * @author Yue
 * ❗️此文件是通过PB工具自动生成，禁止修改，后果自负❗️
 */
export default class {{ clsName }}Message extends MessageBase {

    private static __propertype: any;

    {% for param in params %}{% if param %} 
    public {{ param.name }}: {{ param.type }};{% endif %}{% endfor %}

    public static create(cb: (msg: {{ clsName }}Message) => void) {
        let msg = new {{ clsName }}Message();
        PBUtils.loadFile("proto/{{ filename }}", (e, root) => {
            {{ clsName }}Message.__propertype = root.lookupType("{{ package }}.{{ clsName }}");
            if (cb) { cb(msg); }
        });
    }

    public static loadPbFile(cb: () => {}): void {
        PBUtils.loadFile("proto/{{ filename }}", (e, root) => {
            {{ clsName }}Message.__propertype = root.lookupType("{{ package }}.{{ clsName }}");
            if (cb) { cb(); }
        });
    }

    public toBuffer(): any {
        let payload = this.getObject();
        // 校验数据
        let errMsg = {{ clsName }}Message.__propertype.verify(payload);
        if (errMsg) {
            throw Error(errMsg);
        }
        // Create a new message
        let message = {{ clsName }}Message.__propertype.create(payload);
        // Encode a message to an Uint8Array (browser) or Buffer (node)
        let buffer = {{ clsName }}Message.__propertype.encode(message).finish();
        return buffer;
    }

    public parseBuffer(buffer): void {
        let obj = {{ clsName }}Message.__propertype.decode(buffer);
        this.setObject(obj);
    }

    public setObject(obj: any): void {
        {% for obj in msgObjects %}{% if obj %} 
        {{ obj }};{% endif %}{% endfor %}
    }

    public getObject(): any {
        return {
            {% for obj in objects %}{% if obj %}{{ obj }}
            {% endif %}{% endfor %}
        };
    }

    // 协议pid
    public get PID(): number {
        return {{ pid }};
    }
}
