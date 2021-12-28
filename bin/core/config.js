"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = void 0;
const global_1 = require("config/global");
const tool_1 = require("utils/tool");
const useCmd_1 = require("utils/useCmd");
//配置key描述映射 - [描述: he.config.json中对应的key]
const configMap = {
    运行时展示欢迎文本: 'showWelcome',
    自动安装项目依赖: 'autoInstall',
    尽可能自动启动项目: 'autoStart',
    公共组件生成目录: 'commonComponentDir',
};
function configCommand(program) {
    program
        .command('config')
        .description('配置默认偏好, config')
        .action(async () => {
        const desc = await useCmd_1.select(Object.keys(configMap), '请选择偏好配置项:');
        const key = configMap[desc];
        const val = global_1.config[key];
        const valType = tool_1.getType(val);
        if (valType === 'boolean') {
            //布尔值 - 确认方式
            const res = await useCmd_1.confirm(`是否${val ? '关闭' : '开启'}此项 - ${desc}?`);
            if (res) {
                tool_1.changeConfig(key, !val);
            }
            return;
        }
        if (valType === 'string') {
            //字符串 - 输入方式
            const res = await useCmd_1.input(`当前${desc}为 - ${val}，请输入新的设置：`);
            if (res) {
                tool_1.changeConfig(key, res);
            }
            else {
                tool_1.warnLog('输入不能为空!');
            }
            return;
        }
    });
}
exports.configCommand = configCommand;
