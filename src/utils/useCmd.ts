import { spawn } from 'child_process'
import type { SpawnOptionsWithoutStdio } from 'child_process'

import ora from 'ora'
import inquirer from 'inquirer'
// const clear = require("clear")

import { errLog, redBlack } from 'utils/tool'

/**
 * 子进程执行命令行指令
 * @param loadText 加载提示
 * @param args spawn子进程参数
 */
function cCommand(loadText: string | null, ...args: [string, string[], SpawnOptionsWithoutStdio]): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const spinner = loadText ? ora(loadText) : null
    spinner && spinner.start()

    const cp = spawn(...args)
    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stderr)

    const cmd = args[0]

    cp.on('error', (err: string) => {
      // clear()
      // console.log(args)

      spinner && spinner.fail(`指令错误，请检查是否安装${redBlack(cmd.split('.')[0])}`)
      throw new Error(err)
    })
    cp.on('close', () => {
      spinner && spinner.succeed('完成')
      resolve(true)
    })
  })
}

/**
 * 命令行选择
 * @param opt 可选项
 * @param message 提示文本
 */
function select(opt: string[], message: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const choices: InquirerChoice[] = opt.map((item, index) => {
      return { value: index, name: item }
    })
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'select',
          default: 0, //默认选中第一项
          message,
          choices,
        },
      ])
      .then((res) => {
        resolve(opt[res['select']])
      })
      .catch(({ isTtyError }) => catchInquirer(!!isTtyError))
  })
}

/**
 * 命令行多选
 * @param opt 可选项
 * @param message
 */
function checkbox(opt: string[], message: string): Promise<string[]> {
  return new Promise<string[]>((resolve) => {
    const choices: InquirerCheckbox[] = opt.map((item, index) => {
      return { checked: false, name: item }
    })
    inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'checkbox',
          message,
          choices,
        },
      ])
      .then((res) => {
        resolve(res['checkbox'])
      })
      .catch(({ isTtyError }) => catchInquirer(!!isTtyError))
  })
}
/**
 * 命令行确认
 * @param message 提示文本
 */
function confirm(message: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confirm',
          default: true, //默认选中
          message,
        },
      ])
      .then((res) => {
        resolve(res['confirm'])
      })
      .catch(({ isTtyError }) => catchInquirer(!!isTtyError))
  })
}

/**
 * 命令行输入文本
 * @param message 提示文本
 */
function input(message: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'input',
          // default: true, //默认选中
          message,
        },
      ])
      .then((res) => {
        resolve(res['input'])
      })
      .catch(({ isTtyError }) => catchInquirer(!!isTtyError))
  })
}

//抓取inquirer错误
function catchInquirer(isTtyError: boolean): void {
  let errMsg = '未知错误'

  if (isTtyError) {
    errMsg = "Prompt couldn't be rendered in the current environment"
  }

  errLog(errMsg)
}

export { cCommand, select, checkbox, confirm, input }
