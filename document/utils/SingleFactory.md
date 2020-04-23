## SingleFactory
### 介绍
单例对象在开发中很常用，每个单例对象都单独实现单例逻辑会很繁琐也不方便，不统一，同时单例对象数据也不方便管理。SingleFactory提供了一套快速创建单例对象并且对单例对象进行了管理，可以随时释放掉指定的单例对象，也可以直接释放掉创建过的所有单例对象。

### 接口介绍
- getInstance: 获取单例接口，传入继承SingleBase的类，则会返回该类的单例对象
```javascript
/**
 * 创建接口
 * @param {new() => T} type T是要求继承自SingleBase的类型
 */
static getInstance<T extends SingleBase>(type: new() => T): T;
```
- clear: 清理指定的单例对象
```javascript
/**
 * 释放指定的单例对象
 * @param {new() => T} type T是要求继承自SingleBase的类型
 */
static clear<T extends SingleBase>(type: new() => T): void
```
- clearAll: 清理所有单例对象
```javascript
static clearAll: void;
```

### 用法实例
```javascript
// 目标类要求继承SingleBase
class Test extends SingleBase {
    public test() {
        it.log("我是单例对象");
    }
}
// 获取单例对象
let t = SingleFactory.getInstance(Test);
t.test();
```
### 实现细节
- 主要是通过js可以用字符串调用属性的特性来实现单例对象的创建和赋值。
```javascript
// 传入继承自SingleBase的类型，返回对应的实例对象
public static getInstance<T extends SingleBase>(type: new() => T): T {
    if (!type["_instance"]) {
        let target = new type();
        type["_instance"] = target;
        // 单例对象可以重写init接口来实现初始化逻辑
        target.init();
        // 缓存单例对象的引用，方便管理，用于后期释放
        SingleFactory._instanceList.set(type, target);
        return target;
    }
    return type["_instance"];
}
```