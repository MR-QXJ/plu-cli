"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileEjs = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const ejs_1 = require("ejs");
//promise包装的ejs renderFile
//promisify<arg1, arg2, result>包装函数的参数与结果类型
const ejsRenderFile = util_1.promisify(ejs_1.renderFile);
/**
 * 根据模板生成文件
 * @param tmpPath 模板路径
 * @param filePath 生成路径
 * @param data 模板数据
 */
async function writeFileEjs(tmpPath, filePath, data) {
    const file = await ejsRenderFile(tmpPath, data || {});
    if (!file)
        throw Error('模板生成错误');
    fs_1.default.writeFileSync(filePath, file);
}
exports.writeFileEjs = writeFileEjs;
