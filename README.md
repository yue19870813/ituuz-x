<img src="http://ww1.sinaimg.cn/large/0060lm7Tgy1finqq0pk5lj303k03kjr9.jpg">  

[项目主页:http://ituuz-x.ituuz.com/](http://ituuz-x.ituuz.com/)

ituuz-x
============

# Description
ituuz-x是一个cocos creator游戏开发一个集成框架，也是一个工具集。其包括常用用的项目管理的mvc架构，以及静态数据、本地化、资源管理、网络等模块，后续还会不断拓展新的模块或工具，除核心`core`是必须引用外，其他模块都可以根据需求选择引用，后续会增加模块剔除配置功能。框架后续功能可以参考下面的Planned计划表。

------------

# 入门介绍
- [core-mvc模块介绍:轻量级游戏开发mvc框架](http://ituuz.com/2019/07/15/lightMVC-1/)
- [mvc_ex模块介绍:mvc拓展模块](http://ituuz.com/2019/10/09/mvc-ex/)
- [ituuz-x游戏框架v2.1新特性介绍](http://ituuz.com/2019/11/10/ituuz-x-v2-1特性介绍/)

# 近期版本内容
## v2.2.1新增功能
> 待补充1
- 待补充2

## v2.1版本功能
> v2.1版本主要是修复bug，以及对之前的功能进行了优化。相关文档[ituuz-x游戏框架v2.1新特性介绍](http://ituuz.com/2019/11/10/ituuz-x-v2-1特性介绍/)
- [`new`]增加GameModel基类，目前增加了一些数据接口封装，是为了下个版本数据管理增加支持
- [`new`]View层的GameView增加onShow接口，该接口是view其他初始化结束后最终会调用的接口
- [`new`]ViewEvent增加注册点击事件，方便静态事件注册
- [`new`]Mediator增加customInit接口，该接口会在Mediator的init接口之前调用，通过该接口可对初始化过程进行干预
- [`new`]Mediator增加sceneContent属性，该属性是场景共享数据，在当前场景的所有Mediator中都可以读取该对象
- [`new`]Mediator的addView接口增加parent可选属性，可以自定义设置该view添加到的父节点
- [`new`]Mediator的addView接口增加useCache可选属性，来设置是否复用同类节点，默认false不复用
- [`bug`]修复android真机引起崩溃的问题
- [`bug`]修复Mediator的init和viewDidAppear接口调用顺序错误问题
- [`bug`]修改场景初始化生命周期异常问题
- [`bug`]修复全局场景层级缓存错误问题
- [`ts`]优化代码，增加注释，统一编码风格等

## v2.0新增功能（lightMVC_ex）
> v2.0主要对核心模块中的lightMVC进行了拓展，增加了更多接口和功能，方便更大规模项目使用，相关文档[mvc_ex模块介绍:mvc拓展模块](http://ituuz.com/2019/10/09/mvc-ex/)
- 框架全局可调用的接口
- 新增GameMediator基类
- 新增GameView基类，对应GameMediator，暂无新增功能。
- 图集自动加载功能

## v1.0版本
> 轻量级的mvc框架，相关文档[lightMVC模块介绍:轻量级游戏开发mvc框架](http://ituuz.com/2019/07/15/lightMVC-1/)
- lightMVC核心模块基本功能

# Planned
- FINISHED
	- lightMVC基础框架
    - lightMVC拓展内容lightMVC_ex
    - loader模块及图集资源加载框架基础支持
    - 静态数据模块
    - 日志模块
    - 寻路
    - 网络数据层模块(http)
- TODO 
    - 网络数据层模块（websocket && local）
- NEXT
    - framework工作流（build && culling）
    - 资源自动加载释放
- BACKUP
	- 性能分析支持
    - 自动化测试支持
    - 异常捕获 
    - 新手引导框架
    - 状态机
    - 行为树
    - 动态本地化支持

------------

# How to use in your project
- Cocos Creator : todo

# The command line support
- Command detail : [README.md](https://github.com/yue19870813/ituuz-x/blob/master/tools/README.md)

