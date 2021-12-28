#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const commander_1 = __importDefault(require("commander"));
const global_1 = require("config/global");
const config_1 = require("core/config");
const create_1 = require("core/create");
const jsTool_1 = require("core/js/jsTool");
const vuecpn_1 = require("core/vue/vuecpn");
const vuepage_1 = require("core/vue/vuepage");
const tool_1 = require("utils/tool");
const packageJSON = require('../package.json');
config_1.configCommand(commander_1.default);
create_1.creartCommand(commander_1.default);
jsTool_1.toolCommand(commander_1.default);
vuecpn_1.vuecpnCommand(commander_1.default);
vuepage_1.vuepageCommand(commander_1.default);
global_1.config.showWelcome && tool_1.figLog('Welcome to he-cli');
commander_1.default
    .version(packageJSON.version, '-v, --version')
    .option('-d --dest <destDir>', '指定部分指令(vuecpn、tool)创建文件的子目录')
    .option('-r --route', '新建页面(vuepage)时添加对应路由文件')
    .parse(process.argv);
