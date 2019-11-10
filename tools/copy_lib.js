var fs = require('fs');
var path = require('path');

function getFilePath(path) {
    let index1 = path.lastIndexOf('/');
    let index2 = path.lastIndexOf('\\');

    if (index1 > index2) {
        return path.substring(0, path.lastIndexOf('/') + 1);
    } else {
        return path.substring(0, path.lastIndexOf('\\') + 1);
    }
}

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function copyFile(src, dest) {
    let destPath = getFilePath(dest);

    if (!fs.existsSync(src)) {
        console.log('file not exist:' + src);
        return;
    }
    if (!fs.existsSync(destPath)) {
        mkdirsSync(destPath);
    }
    let buf = new Buffer(1024);

    let srcFd = fs.openSync(src, 'r');
    let len = fs.readSync(srcFd, buf, 0, 1024);
    let destFd = fs.openSync(dest, 'w');

    while (len > 0) {
        fs.writeSync(destFd, buf, 0, len);
        len = fs.readSync(srcFd, buf, 0, 1024);
    }
    fs.closeSync(srcFd);
    fs.closeSync(destFd);
}

function copyDir(srcPath, destPath) {
    let stat = fs.statSync(srcPath);
    if (!stat.isDirectory()) {
        copyFile(srcPath, destPath);
        return;
    }

    let subpaths = fs.readdirSync(srcPath), subpath;
    for (let i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = srcPath + '/' + subpaths[i];
        let destFileName = destPath + '/' + subpaths[i];
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            copyDir(subpath, destFileName);
        } else if (stat.isFile()) {
            copyFile(subpath, destFileName);
        }
    }
}

// 删除文件夹及其内容
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

// 将copy接口导出
exports.copyDirs = copyDir;
exports.deleteDirs = deleteFolderRecursive;

// let PROJECT_PATH = "/Users/yue/private/BH/client/BH/assets/Lib";
let PROJECT_PATH = "/Users/yue/private/ituuz-x/samples/LightmvcDemo/assets/libs";

// delete
deleteFolderRecursive(PROJECT_PATH + "/core/");
deleteFolderRecursive(PROJECT_PATH + "/mvc_ex/");
deleteFolderRecursive(PROJECT_PATH + "/extension/");

// copy
// copyDir("./../itz.d.ts", PROJECT_PATH + "/framework.d.ts");
copyDir("./../ituuzx/core/", PROJECT_PATH + "/core/");
copyDir("./../ituuzx/mvc_ex/", PROJECT_PATH + "/mvc_ex/");
copyDir("./../ituuzx/extension/", PROJECT_PATH + "/extension/");
copyDir("./../ituuzx/Framework.ts", PROJECT_PATH + "/Framework.ts");
copyDir("./../ituuzx/FrameworkCfg.ts", PROJECT_PATH + "/FrameworkCfg.ts");