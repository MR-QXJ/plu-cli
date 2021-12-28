"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vuecpnCommand = void 0;
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const global_1 = require("config/global");
const useEjs_1 = require("utils/useEjs");
const useCmd_1 = require("utils/useCmd");
const tool_1 = require("utils/tool");
//公共组件ejs映射 - [描述: 目录名称]
const dirMap = {
    '基于ant-design-vue': 'ant-design-vue',
    公共: 'common',
};
function vuecpnCommand(program) {
    program
        .command('vuecpn [cpnName]')
        .description('创建vue组件, vuecpn [cpnName] [-d cpnDir]')
        .action(async (cpnName) => {
        const { dest } = program.opts();
        if (cpnName) {
            createCpn(cpnName, dest);
        }
        else {
            const cpnDesc = await useCmd_1.select(Object.keys(dirMap), '请选择组件类型:');
            createCpnCommon(dirMap[cpnDesc], dest);
        }
    });
}
exports.vuecpnCommand = vuecpnCommand;
/**
 * 生成初始组件
 * @param cpnName 自定义的组件名称
 * @param dest -d指定的存放目录
 */
async function createCpn(cpnName, dest) {
    const spinner = ora_1.default(`创建${cpnName}${cpnName}组件...`);
    try {
        let targetDir = 'components';
        if (dest) {
            targetDir += `/${dest}`;
        }
        spinner.start();
        const lowerName = cpnName.toLowerCase();
        const targetPath = tool_1.resolve(global_1.targetRoot, targetDir);
        tool_1.compilePath(targetPath);
        let filePath = tool_1.resolve(targetPath, `${cpnName}.vue`);
        const proceed = await tool_1.existsFileCover(filePath, spinner);
        if (proceed) {
            await useEjs_1.writeFileEjs(tool_1.resolve(global_1.resolveTmp, 'vue/cpn.ejs'), filePath, {
                name: cpnName,
                lowerName,
            });
            spinner.succeed(`创建成功: ${filePath}`);
        }
    }
    catch (err) {
        spinner.fail('创建失败');
        err && tool_1.errLog(err);
    }
}
/**
 * 从公共组件目录选择生成组件
 * @param tmpDir
 * @param dest -d指定的存放目录
 */
async function createCpnCommon(tmpDir, dest) {
    const spinner = ora_1.default(`创建公共组件...`);
    try {
        //选中类型下所有模板文件
        const tempFiles = fs_1.default.readdirSync(tool_1.resolve(global_1.resolveTmp, 'vue', 'components', tmpDir));
        //选中类型下所有模板文件名称
        const tempFilesName = tempFiles.map((file) => file.split('.')[0]);
        //目标文件夹
        const targetDir = `components/${global_1.config.commonComponentDir}${dest ? `/${dest}` : ''}`;
        if (!tempFiles.length)
            throw Error('该项正在建设中，敬请期待...');
        //选中的模板文件名称
        const cpnNameTmps = await useCmd_1.checkbox(tempFilesName, '请选择要添加的公共组件:');
        //选中的数量
        const checkLen = cpnNameTmps.length;
        if (!checkLen)
            return;
        spinner.start();
        const targetPath = tool_1.resolve(global_1.targetRoot, targetDir);
        //上下文目录是否存在，不存在创建
        tool_1.compilePath(targetPath);
        //询问已存在的同名文件是否覆盖
        let files = [];
        for (let i = 0; i < checkLen; i++) {
            const cpnNameTmp = cpnNameTmps[i];
            let filePath = tool_1.resolve(targetPath, `${cpnNameTmp}.vue`);
            const proceed = await tool_1.existsFileCover(filePath, spinner);
            if (proceed) {
                files.push({ filePath, cpnNameTmp });
            }
        }
        //创建允许的组件
        const fileLen = files.length;
        for (let i = 0; i < fileLen; i++) {
            const { filePath, cpnNameTmp } = files[i];
            await useEjs_1.writeFileEjs(tool_1.resolve(global_1.resolveTmp, `vue/components/${tmpDir}/${cpnNameTmp}.ejs`), filePath);
        }
        spinner.succeed(`创建成功: ${cpnNameTmps.map((n) => (n += '.vue')).join('、')}`);
    }
    catch (err) {
        spinner.fail('创建失败');
        err && tool_1.errLog(err);
    }
}
