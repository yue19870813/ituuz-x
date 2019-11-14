/**
 * 消息枚举类型
 * @author Yue
 * ❗️此文件是通过PB工具自动生成，禁止修改，后果自负❗️
 */
import MessageBase from "../../../libs/extension/net/MessageBase";
{% for param in params %}{% if param %}
import {{ param.name }} from "./{{ param.name }}";{% endif %}{% endfor %}

export default class MessageType {
    /** 协议映射关系map */
    public static rsMap: Map<number, new() => MessageBase> = new Map();
    {% for param in params %}{% if param %} 
    public static readonly {{ param.name }}: number = {{ param.pid }};{% endif %}{% endfor %}

    /** 初始化协议映射关系map */
    public static init(): void {
        {% for param in params %}{% if param %} 
        MessageType.rsMap.set(MessageType.{{ param.name }}, {{ param.name }});{% endif %}{% endfor %}
    }
}