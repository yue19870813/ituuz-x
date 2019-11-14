/**
 * 协议枚举类
 * @author Yue
 * ❗️此文件是通过PB工具自动生成，禁止修改，后果自负❗️
 */
export enum {{ clsName }}Message {
    {% for param in params %}{% if param %} 
    {{ param.name }} {{ param.value }},{% endif %}{% endfor %}
}
