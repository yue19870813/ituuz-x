let fs = require("fs");
let swig = require('swig');
let cfg = require("./config");
let exec = require('child_process').exec;

// 获取无后缀名文件
function getNoSuffixName(filename) {
    let idx = filename.lastIndexOf("."); 
    let name = filename.substring(0, idx);
    return name;
}

// 首字母大写
function firstUpperCase(str) {
    return str.replace(/^\S/, s => s.toUpperCase());
}

// 获取导入内容
function getImport(str) {
    if (str != "string" && str != "int32" && str != "bool" && str != "bytes") {
        if (ENUM_LIST.indexOf(str) >= 0) {
            return "{ " + firstUpperCase(str) + "Message }";
        }
        return firstUpperCase(str) + "Message";
    }
    return "";
}

// 获取类型或者类名
function getTypeCls(str, isArray) {
    let t = "any";
    if (str == "string") {
        t = "string";
    } else if (str == "int32" || str == "int 64") {
        t = "number";
    } else if (str == "bool") {
        t = "boolean";
    } else if (str == "bytes") {
        t = "any";
    } else {
        t = firstUpperCase(str) + "Message";
    }
    if (isArray) {
        return t + "[]";
    } else {
        return t;
    }
}
/** 所有pb文件的PID列表 */
let PID_LIST = [];
/** 所有pb文件的enum列表 */
let ENUM_LIST = [];

// 生成PB的json配置文件
function generatePbJson(file) {
    let shell = `${cfg.Config.PBJS} ${cfg.Config.ProtoPath}${file}.proto > ${cfg.Config.JSON_OUTPUT}${file}.json`;
    exec(shell, function (error, stdout, stderr) {
        if (error) {
            Editor.log(file + ".proto 生成json配置文件失败");
            return;
        }
        Editor.log(file + ".proto 生成json配置文件完成");
    });
}

function getObjects(pType, pName, isArr) {
    if (isArr) {
        if (pType == "string" || pType == "int32" || pType == "bytes") {
            return pName + ": this." + pName + ",";
        } else {
            return pName + ": PBUtils.getArrayObjects(this." + pName + "),";
        }
    } else {
        if (pType == "string" || pType == "int32" || pType == "bytes") {
            return pName + ": this." + pName + ",";
        } else if (ENUM_LIST.indexOf(pType) >= 0) {
            return pName + ": this." + pName + ",";
        } else {
            return pName + ": this." + pName + ".getObject(),";
        }
    }
}

function getMsgObjects(pType, pName, isArr) {
    if (isArr) {
        if (pType == "string" || pType == "int32" || pType == "bytes") {
            return "this." + pName + " = obj." + pName + ";";
        } else if (ENUM_LIST.indexOf(pType) >= 0) {
            return "this." + pName + " = obj." + pName + ";";
        } else {
            return "this." + pName + " = PBUtils.getArrayMessages(obj." + pName + ", " + firstUpperCase(pType) + "Message);";
        }
    } else {
        if (pType == "string" || pType == "int32" || pType == "bytes") {
            return "this." + pName + " = obj." + pName + ";";
        } else if (ENUM_LIST.indexOf(pType) >= 0) {
            return "this." + pName + " = obj." + pName + ";";
        } else {
            return "this." + pName + " = PBUtils.getMessage(obj." + pName + ", " + firstUpperCase(pType) + "Message);";
        }
    }
}

// 生成每个message对应的类对象
function generateMessage(filename) {
    let fileData = fs.readFileSync(cfg.Config.ProtoPath + filename + ".proto", "utf-8");
    // 获取包名
    let packageName = fileData.match(/package[^\n\r]*;/g)[0];
    packageName = packageName.replace("package", "").replace(";", "").trim();

    // 解析单个message
    let messagesList = fileData.match(/PID_KEY:[^}]*}/g);
    if (!messagesList || messagesList.length <= 0) {
        return;
    }
    // let messages = messagesList[0].split("}");
    for (let msg of messagesList) {
        if (!msg || msg == "" || msg.length == 0) {
            continue;
        }
        let lines = msg.split("\n");
        // 获取pid
        let PID = lines[0].replace("PID_KEY:", "").trim();
        if (PID == "") {
            lines.shift();
            lines.shift();
            PID = lines[0].replace("PID_KEY:", "").replace("//", "").trim();
        }
        lines.shift();
        // 获取类名
        let clsName = lines.shift();
        clsName = clsName.replace("message", "").replace("{", "").trim();
        // 开始获取属性列表和import列表
        lines.splice(lines.length - 1, 1);
        let pList = [];
        let importList = [];
        let objectsList = [];
        let msgList = [];
        for (let line of lines) {
            if (!line || line == "" || line.length == 0) {
                continue;
            }
            line = line.trim(); // line = "repeated string uid = 1;"
            let isArr = (line.indexOf("repeated") >= 0);
            line = line.replace("repeated", "").replace("optional", "").replace("required", "").trim(); // line = "string uid = 1";
            // line = line.substring(line.indexOf(" ")).trim(); 
            line = line.substring(0, line.indexOf("=")).trim(); // line = "string uid"
            let temp = line.split(" ");
            let pType = temp[0];    // 字段类型
            let pName = temp[1];    // 字段名称
            // 构造需要导入的类
            let imp = getImport(pType);
            if (imp != "") {
                let iName = imp;
                let iUrl = imp.replace("{", "").replace("}", "").trim();
                importList.push({name: iName, url: iUrl});
            }
            // 构造属性列表
            let pa = {
                type: getTypeCls(pType, isArr),
                name: pName
            };
            pList.push(pa);
            // 构造获取对象结构列表
            objectsList.push(getObjects(pType, pName, isArr));
            msgList.push(getMsgObjects(pType, pName, isArr));
        }
        // 构造模版参数
        let swigParam = {
            clsName: firstUpperCase(clsName),  // 类名
            filename: filename,     // 文件名
            package: packageName,     // 包名
            pid: PID,     // 协议pid
            params: pList,     // 属性列表
            objects: objectsList,      // 对象结构列表
            msgObjects: msgList,    // mes对象列表
            imports: importList     // 需要导入的类
        };
        // 保存类型
        PID_LIST.push({name: swigParam.clsName + "Message", pid: PID});
        // 导入模版文件
        let rPath = Editor.url("packages://pb-generator/message.swig");
        let template = swig.compileFile(rPath);
        let output = template(swigParam);
        // 将output写入ts文件
        fs.writeFileSync(cfg.Config.TS_OUTPUT + swigParam.clsName + "Message.ts", output);
    }
}

/** 生成枚举文件messge */
function generateEnum(filename) {
    let fileData = fs.readFileSync(cfg.Config.ProtoPath + filename + ".proto", "utf-8");
    // 解析单个message
    let messagesList = fileData.match(/enum[^}]*}/g);
    if (!messagesList) return;
    for (let enumMsg of messagesList) {
        if (!enumMsg || enumMsg == "" || enumMsg.length == 0) {
            continue;
        }
        let lines = enumMsg.split("\n");
        // 获取类名
        let clsName = lines.shift();
        clsName = clsName.replace("enum", "").replace("{", "").trim();
        // 开始获取属性列表
        lines.splice(lines.length - 1, 1);
        let pList = [];
        for (let line of lines) {
            if (!line || line == "" || line.length == 0) {
                continue;
            }
            line = line.trim(); // line = ContainerTypeEquipList = 0;
            let name = line.substring(0, line.indexOf("=")).trim(); // name = ContainerTypeEquipList
            let value = line.substring(line.indexOf("=")).trim().replace(";", ",");   // value = 0;
            pList.push({name, value});
        }
        // 构造模版参数
        let swigParam = {
            clsName: firstUpperCase(clsName),  // 类名
            params: pList,     // 属性列表
        };
        // 导入模版文件
        let rPath = Editor.url("packages://pb-generator/messageEnum.swig");
        let template = swig.compileFile(rPath);
        let output = template(swigParam);
        // 将output写入ts文件
        fs.writeFileSync(cfg.Config.TS_OUTPUT + swigParam.clsName + "Message.ts", output);
        ENUM_LIST.push(clsName);
    }
}

function nextRun() {
    Editor.log("开始生成协议枚举文件...");
    // 生成枚举文件
    // 导入模版文件
    let mPath = Editor.url("packages://pb-generator/messageType.swig");
    let templ = swig.compileFile(mPath);
    let msgType = {
        params: PID_LIST
    };
    let output = templ(msgType);
    fs.writeFileSync(cfg.Config.TS_OUTPUT + "MessageType.ts", output);
    Editor.log("成协议枚举文件完成");

    setTimeout(() => {
        // 刷新资源
        for (let path of cfg.Config.REFRESH_PATH) {
            Editor.assetdb.refresh(path, ()=>{});
        }
    }, 1000);
}

function run() {
    PID_LIST = [];
    ENUM_LIST = [];
    let rootPath = cfg.Config.ProtoPath;
    // 遍历配置目录下的所有excel文件
    let files = fs.readdirSync(rootPath);
    for (let file of files) {
        if (file.lastIndexOf(".proto") < 0) {
            continue;
        }
        // 生成json
        generatePbJson(getNoSuffixName(file));
        // 生成枚举文件类
        generateEnum(getNoSuffixName(file));
    }
    setTimeout(() => {
        for (let file of files) {
            if (file.lastIndexOf(".proto") < 0) {
                continue;
            }
            // 生成每个message对应的类对象
            generateMessage(getNoSuffixName(file));
        }
        setTimeout(() => {
            nextRun();
        }, 500);
    }, 1000);
}

exports.run = run;