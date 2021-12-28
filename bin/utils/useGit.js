"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadGit = void 0;
const ora_1 = __importDefault(require("ora"));
const tool_1 = require("utils/tool");
const download = require('download-git-repo');
/**
 * 从git下载项目模板
 * @param targetGit 模板地址
 * @param projectName 项目名
 */
function downloadGit(targetGit, projectName) {
    const spinner = ora_1.default('downloading...');
    return new Promise((resolve, reject) => {
        if (!targetGit) {
            reject();
            return tool_1.warnLog('未知的项目类型，请重试~');
        }
        tool_1.log('正在创建项目，请稍后...');
        spinner.start();
        download(targetGit, projectName, { clone: true }, (err) => {
            if (err) {
                spinner.fail('创建失败');
                tool_1.errLog(err);
                return reject();
            }
            spinner.succeed('项目创建成功！');
            resolve(true);
        });
    });
}
exports.downloadGit = downloadGit;
