"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = exports.confirm = exports.checkbox = exports.select = exports.cCommand = void 0;
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
// const clear = require("clear")
const tool_1 = require("utils/tool");
/**
 * 子进程执行命令行指令
 * @param loadText 加载提示
 * @param args spawn子进程参数
 */
function cCommand(loadText, ...args) {
    return new Promise((resolve) => {
        const spinner = loadText ? ora_1.default(loadText) : null;
        spinner && spinner.start();
        const cp = child_process_1.spawn(...args);
        cp.stdout.pipe(process.stdout);
        cp.stderr.pipe(process.stderr);
        const cmd = args[0];
        cp.on('error', (err) => {
            // clear()
            // console.log(args)
            spinner && spinner.fail(`指令错误，请检查是否安装${tool_1.redBlack(cmd.split('.')[0])}`);
            throw new Error(err);
        });
        cp.on('close', () => {
            spinner && spinner.succeed('完成');
            resolve(true);
        });
    });
}
exports.cCommand = cCommand;
/**
 * 命令行选择
 * @param opt 可选项
 * @param message 提示文本
 */
function select(opt, message) {
    return new Promise((resolve) => {
        const choices = opt.map((item, index) => {
            return { value: index, name: item };
        });
        inquirer_1.default
            .prompt([
            {
                type: 'list',
                name: 'select',
                default: 0,
                message,
                choices,
            },
        ])
            .then((res) => {
            resolve(opt[res['select']]);
        })
            .catch(({ isTtyError }) => catchInquirer(!!isTtyError));
    });
}
exports.select = select;
/**
 * 命令行多选
 * @param opt 可选项
 * @param message
 */
function checkbox(opt, message) {
    return new Promise((resolve) => {
        const choices = opt.map((item, index) => {
            return { checked: false, name: item };
        });
        inquirer_1.default
            .prompt([
            {
                type: 'checkbox',
                name: 'checkbox',
                message,
                choices,
            },
        ])
            .then((res) => {
            resolve(res['checkbox']);
        })
            .catch(({ isTtyError }) => catchInquirer(!!isTtyError));
    });
}
exports.checkbox = checkbox;
/**
 * 命令行确认
 * @param message 提示文本
 */
function confirm(message) {
    return new Promise((resolve) => {
        inquirer_1.default
            .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                default: true,
                message,
            },
        ])
            .then((res) => {
            resolve(res['confirm']);
        })
            .catch(({ isTtyError }) => catchInquirer(!!isTtyError));
    });
}
exports.confirm = confirm;
/**
 * 命令行输入文本
 * @param message 提示文本
 */
function input(message) {
    return new Promise((resolve) => {
        inquirer_1.default
            .prompt([
            {
                type: 'input',
                name: 'input',
                // default: true, //默认选中
                message,
            },
        ])
            .then((res) => {
            resolve(res['input']);
        })
            .catch(({ isTtyError }) => catchInquirer(!!isTtyError));
    });
}
exports.input = input;
//抓取inquirer错误
function catchInquirer(isTtyError) {
    let errMsg = '未知错误';
    if (isTtyError) {
        errMsg = "Prompt couldn't be rendered in the current environment";
    }
    tool_1.errLog(errMsg);
}
