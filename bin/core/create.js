"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creartCommand = void 0;
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
const global_1 = require("config/global");
const tool_1 = require("utils/tool");
const useCmd_1 = require("utils/useCmd");
const useGit_1 = require("utils/useGit");
function creartCommand(program) {
    program
        .command('create <projectName>')
        .description('初始化项目, create <projectName>')
        .action(async (projectName) => {
        if (fs_1.default.existsSync(projectName)) {
            const isDel = await useCmd_1.confirm('当前目录存在同名文件夹，立即删除原文件？');
            if (!isDel)
                return tool_1.errLog('创建失败，请更换名称');
            const spinner = ora_1.default('删除中...');
            spinner.start();
            try {
                tool_1.deleteFolder(projectName);
                spinner.succeed('删除成功!');
            }
            catch (err) {
                spinner.fail('删除失败，请尝试手动删除或更换名称');
                err && tool_1.errLog(err);
                throw Error(); //再抛出错误，停止后续代码进行
            }
        }
        const fkMap = {
            vue: createVue,
            'uni-app': createUni,
        };
        const framework = await useCmd_1.select(Object.keys(fkMap), '请选择该项目使用的框架:');
        const fk = framework.toLowerCase();
        try {
            await fkMap[fk]?.(projectName);
        }
        catch (err) {
            err && tool_1.errLog(err);
        }
    });
}
exports.creartCommand = creartCommand;
//创建vue项目模板
async function createVue(projectName) {
    const tmpGit = await useCmd_1.select(Object.keys(global_1.gitMapVue), '请选择项目模板:');
    await useGit_1.downloadGit(global_1.gitMapVue[tmpGit], projectName);
    if (global_1.config.autoInstall) {
        await useCmd_1.cCommand('正在安装依赖...', global_1.npm, ['i', '--registry=https://registry.npm.taobao.org'], {
            cwd: projectName,
        });
        if (global_1.config.autoStart) {
            tool_1.log('正在启动项目...');
            await useCmd_1.cCommand(null, global_1.npm, ['start'], { cwd: projectName });
        }
    }
}
//创建uni-app项目模板
async function createUni(projectName) {
    const tmpGit = await useCmd_1.select(Object.keys(global_1.gitMapUni), '请选择项目模板:');
    await useGit_1.downloadGit(global_1.gitMapUni[tmpGit], projectName);
}
