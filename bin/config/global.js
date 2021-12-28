"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitMapUni = exports.gitMapVue = exports.npm = exports.targetRoot = exports.resolveTmp = exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const tool_1 = require("utils/tool");
//读取默认配置
exports.config = require('../../he.config.json');
//template目录绝对路径 (ejs不会被tsc编译, bin目录下不会有)
exports.resolveTmp = tool_1.resolve(__dirname, '../../src/template');
//生成根目录
exports.targetRoot = fs_1.default.existsSync('./src') ? './src' : '';
//npm指令，根据平台不同
exports.npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const vueTmpUrl = 'direct:http://183.230.162.215:8888/fe/cli-template-vue.git';
const uniTmpUrl = 'direct:http://183.230.162.215:8888/fe/cli-template-uni-app.git';
//git模板地址(download-git-repo)
//vue项目
exports.gitMapVue = {
    'ant-design-vue': `${vueTmpUrl}#master`,
    vant: `${vueTmpUrl}#vant`,
    'vant-app': `${vueTmpUrl}#vant-app`,
    element: `${vueTmpUrl}#element`,
};
//uni-app项目
exports.gitMapUni = {
    uview: `${uniTmpUrl}#master`,
};
