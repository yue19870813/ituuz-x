/**
 * 插件配置文件
 * 主要用于配置各种路径
 */
// 加了个延迟，否则读取不到编辑器的本地路径。
setTimeout(() => {
    let rPath = Editor.url("packages://pb-generator/");
    rPath = rPath.replace("client/flyshooting/packages/pb-generator/", "");
    Editor.log("工程目录：" + rPath);

    let Config = {
        ProjectPath: rPath,     // 项目目录
        ProtoPath: rPath + "proto/",    // .proto文件存放目录
        PBJS: rPath + "client/flyshooting/node_modules/protobufjs/bin/pbjs",    // pb工具目录
        JSON_OUTPUT: rPath + "client/flyshooting/assets/resources/proto/",  // pb生成的json文件目录
        TS_OUTPUT: rPath + "client/flyshooting/assets/script/net/proto/",   // pb工具生成的代码目录
        REFRESH_PATH: [     // 需要刷新的目录
            "db://assets/resources/net",
            "db://assets/script/config"
        ]
    };

    exports.Config = Config;
}, 2000);