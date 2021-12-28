"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vuepageCommand = void 0;
const ora_1 = __importDefault(require("ora"));
const global_1 = require("config/global");
const useEjs_1 = require("utils/useEjs");
const tool_1 = require("utils/tool");
function vuepageCommand(program) {
    program
        .command('vuepage <pageName>')
        .description('创建vue页面, vuepage <pageName> [-r]')
        .action(async (pageName) => {
        const isRoute = program.opts().route;
        const spinner = ora_1.default(`创建${pageName}页...`);
        try {
            spinner.start();
            const lowerName = pageName.toLowerCase();
            const targetPath = tool_1.resolve(global_1.targetRoot, `views/${pageName}`);
            tool_1.compilePath(targetPath);
            const pageFilePath = tool_1.resolve(targetPath, `${pageName}.vue`);
            const routerFilePath = tool_1.resolve(targetPath, 'router.js');
            const writeFiles = [
                {
                    path: pageFilePath,
                    ejs: 'cpn.ejs',
                },
            ];
            isRoute &&
                writeFiles.push({
                    path: routerFilePath,
                    ejs: 'router.ejs',
                });
            const proceed = (isRoute &&
                (await tool_1.existsFileCover(pageFilePath, spinner)) &&
                (await tool_1.existsFileCover(routerFilePath, spinner))) ||
                (await tool_1.existsFileCover(pageFilePath, spinner));
            if (proceed) {
                const data = { name: pageName, lowerName };
                for (const { path, ejs } of writeFiles) {
                    await useEjs_1.writeFileEjs(tool_1.resolve(global_1.resolveTmp, `vue/${ejs}`), path, data);
                }
                spinner.succeed(`创建成功: ${targetPath}`);
            }
        }
        catch (err) {
            spinner.fail('创建失败');
            err && tool_1.errLog(err);
        }
    });
}
exports.vuepageCommand = vuepageCommand;
