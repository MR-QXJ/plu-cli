"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = exports.changeConfig = exports.deleteFolder = exports.resolve = exports.existsFileCover = exports.compilePath = exports.figLog = exports.redBlack = exports.errLog = exports.warnLog = exports.log = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const figlet = require('figlet').textSync;
const global_1 = require("config/global");
const useCmd_1 = require("utils/useCmd");
//控制台文本
const log = (content) => console.log(chalk_1.default.blue(`\r\n${content}\r\n`));
exports.log = log;
const warnLog = (content) => console.log(chalk_1.default `{rgb(255,131,0) \r\n${content}\r\n}`);
exports.warnLog = warnLog;
const errLog = (content) => console.log(chalk_1.default.red(`\r\n${content}\r\n`));
exports.errLog = errLog;
//黑低红文本
const redBlack = (content) => chalk_1.default.red.bgBlack(content);
exports.redBlack = redBlack;
//FIGFont风格文本
function figLog(content) {
    const data = figlet(content);
    console.log(chalk_1.default.green(data));
}
exports.figLog = figLog;
//path.resolve
function resolve(...args) {
    return path_1.default.resolve(...args);
}
exports.resolve = resolve;
//解析并打通路径，有目录不存在则创建
function compilePath(cPath) {
    if (fs_1.default.existsSync(cPath))
        return;
    const parentDir = path_1.default.dirname(cPath);
    compilePath(parentDir);
    fs_1.default.mkdirSync(cPath);
}
exports.compilePath = compilePath;
/**
 * 写入文件前，判断目标文件是否已存在并提示
 * @param filePath 文件路径
 * @param spinner 需要被暂停的ora实例(确认询问时需要暂停)
 * @param errMsg 选择不覆盖的提示
 * @returns 是否允许写入文件
 */
async function existsFileCover(filePath, spinner, errMsg = '创建失败，名称已存在') {
    if (fs_1.default.existsSync(filePath)) {
        //暂停加载状态
        spinner && spinner.stopAndPersist();
        const cover = await useCmd_1.confirm(`${filePath}已存在同名文件，是否覆盖?`);
        if (!cover) {
            throw Error(errMsg);
        }
    }
    spinner && spinner.start();
    return true;
}
exports.existsFileCover = existsFileCover;
/**
 * 删除文件夹及其所有内容
 * @param path 文件夹路径
 */
function deleteFolder(path) {
    let files = [];
    if (fs_1.default.existsSync(path)) {
        files = fs_1.default.readdirSync(path);
        files.forEach((file) => {
            const curPath = path + '/' + file;
            if (fs_1.default.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            }
            else {
                fs_1.default.unlinkSync(curPath);
            }
        });
        fs_1.default.rmdirSync(path);
    }
}
exports.deleteFolder = deleteFolder;
/**
 * 修改默认配置
 * @param key 配置项key
 * @param val 配置项值
 */
function changeConfig(key, val) {
    try {
        const curConfig = global_1.config;
        curConfig[key] = val;
        //JSON.stringify后边的参数优化格式，避免紧凑一行
        fs_1.default.writeFileSync(resolve(__dirname, '../../he.config.json'), JSON.stringify(curConfig, null, '\t'));
        log('配置成功!');
    }
    catch (err) {
        err && errLog(err);
    }
}
exports.changeConfig = changeConfig;
/**
 * 获取数据类型
 * @param val 数据值
 * @returns 类型(小写)
 */
function getType(val) {
    const typeStr = Object.prototype.toString.call(val);
    return typeStr.match(/[a-zA-Z]+/g)?.[1].toLowerCase();
}
exports.getType = getType;
