"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolCommand = void 0;
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
const global_1 = require("config/global");
const useEjs_1 = require("utils/useEjs");
const useCmd_1 = require("utils/useCmd");
const tool_1 = require("utils/tool");
//读取所有工具模板文件名(去掉后缀)
const tmpDir = fs_1.default.readdirSync(tool_1.resolve(global_1.resolveTmp, 'js'));
const tools = tmpDir.map((file) => file.split('.')[0]);
function toolCommand(program) {
    program
        .command('tool')
        .description('创建js工具, tool [-d toolPath]')
        .action(async () => {
        const toolName = await useCmd_1.select(tools, '请选择要添加的js工具:');
        const spinner = ora_1.default(`创建${toolName}.js...`);
        try {
            spinner.start();
            const dest = program.opts().dest;
            const targetDir = dest ? `utils/${dest}` : `utils`;
            const targetPath = tool_1.resolve(global_1.targetRoot, targetDir);
            tool_1.compilePath(targetPath);
            const filePath = tool_1.resolve(targetPath, `${toolName}.js`);
            const proceed = await tool_1.existsFileCover(filePath, spinner);
            if (proceed) {
                await useEjs_1.writeFileEjs(tool_1.resolve(global_1.resolveTmp, `js/${toolName}.ejs`), filePath);
                spinner.succeed(`创建成功: ${filePath}`);
            }
        }
        catch (err) {
            spinner.fail('创建失败');
            err && tool_1.errLog(err);
        }
    });
}
exports.toolCommand = toolCommand;
