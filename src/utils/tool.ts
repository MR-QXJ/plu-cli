import path from 'path'
import fs from 'fs'

import chalk from 'chalk'
const figlet = require('figlet').textSync

import { config } from 'config/global'
import { confirm } from 'utils/useCmd'

import type { Ora } from 'ora'

//控制台文本
const log = (content: string): void => console.log(chalk.blue(`\r\n${content}\r\n`))
const warnLog = (content: string): void => console.log(chalk`{rgb(255,131,0) \r\n${content}\r\n}`)
const errLog = (content: string | unknown): void => console.log(chalk.red(`\r\n${content}\r\n`))

//黑低红文本
const redBlack = (content: string): string => chalk.red.bgBlack(content)

//FIGFont风格文本
function figLog(content: string): void {
  const data: string = figlet(content)
  console.log(chalk.green(data))
}

//path.resolve
function resolve(...args: string[]): string {
  return path.resolve(...args)
}

//解析并打通路径，有目录不存在则创建
function compilePath(cPath: string): void {
  if (fs.existsSync(cPath)) return
  const parentDir: string = path.dirname(cPath)
  compilePath(parentDir)

  fs.mkdirSync(cPath)
}

/**
 * 写入文件前，判断目标文件是否已存在并提示
 * @param filePath 文件路径
 * @param spinner 需要被暂停的ora实例(确认询问时需要暂停)
 * @param errMsg 选择不覆盖的提示
 * @returns 是否允许写入文件
 */
async function existsFileCover(
  filePath: string,
  spinner?: Ora,
  errMsg: string = '创建失败，名称已存在'
): Promise<boolean> {
  if (fs.existsSync(filePath)) {
    //暂停加载状态
    spinner && spinner.stopAndPersist()
    const cover = await confirm(`${filePath}已存在同名文件，是否覆盖?`)
    if (!cover) {
      throw Error(errMsg)
    }
  }
  spinner && spinner.start()
  return true
}

/**
 * 删除文件夹及其所有内容
 * @param path 文件夹路径
 */
function deleteFolder(path: string): void {
  let files: string[] = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file) => {
      const curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

/**
 * 修改默认配置
 * @param key 配置项key
 * @param val 配置项值
 */
function changeConfig(key: string, val: any) {
  try {
    const curConfig = config
    curConfig[key] = val

    //JSON.stringify后边的参数优化格式，避免紧凑一行
    fs.writeFileSync(resolve(__dirname, '../../he.config.json'), JSON.stringify(curConfig, null, '\t'))
    log('配置成功!')
  } catch (err) {
    err && errLog(err)
  }
}

/**
 * 获取数据类型
 * @param val 数据值
 * @returns 类型(小写)
 */
function getType(val: any) {
  const typeStr = Object.prototype.toString.call(val)
  return typeStr.match(/[a-zA-Z]+/g)?.[1].toLowerCase()
}

export {
  log,
  warnLog,
  errLog,
  redBlack,
  figLog,
  compilePath,
  existsFileCover,
  resolve,
  deleteFolder,
  changeConfig,
  getType,
}
