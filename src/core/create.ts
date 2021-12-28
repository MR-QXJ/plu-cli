import fs from 'fs'

import ora from 'ora'

import { config, npm, gitMapVue, gitMapUni } from 'config/global'
import { log, errLog, deleteFolder } from 'utils/tool'
import { cCommand, select, confirm } from 'utils/useCmd'
import { downloadGit } from 'utils/useGit'

import type { CommanderStatic } from 'commander'

export function creartCommand(program: CommanderStatic): void {
  program
    .command('create <projectName>')
    .description('初始化项目, create <projectName>')
    .action(async (projectName: string) => {
      if (fs.existsSync(projectName)) {
        const isDel: boolean = await confirm('当前目录存在同名文件夹，立即删除原文件？')
        if (!isDel) return errLog('创建失败，请更换名称')

        const spinner = ora('删除中...')
        spinner.start()
        try {
          deleteFolder(projectName)
          spinner.succeed('删除成功!')
        } catch (err) {
          spinner.fail('删除失败，请尝试手动删除或更换名称')
          err && errLog(err)
          throw Error() //再抛出错误，停止后续代码进行
        }
      }

      const fkMap: fkKey = {
        vue: createVue,
        'uni-app': createUni,
      }

      const framework: string = await select(Object.keys(fkMap), '请选择该项目使用的框架:')
      const fk = framework.toLowerCase()

      try {
        await fkMap[fk]?.(projectName)
      } catch (err) {
        err && errLog(err)
      }
    })
}

//创建vue项目模板
async function createVue(projectName: string): Promise<void> {
  const tmpGit = await select(Object.keys(gitMapVue), '请选择项目模板:')
  await downloadGit(gitMapVue[tmpGit], projectName)

  if (config.autoInstall) {
    await cCommand('正在安装依赖...', npm, ['i', '--registry=https://registry.npm.taobao.org'], {
      cwd: projectName,
    })
    if (config.autoStart) {
      log('正在启动项目...')
      await cCommand(null, npm, ['start'], { cwd: projectName })
    }
  }
}

//创建uni-app项目模板
async function createUni(projectName: string): Promise<void> {
  const tmpGit = await select(Object.keys(gitMapUni), '请选择项目模板:')
  await downloadGit(gitMapUni[tmpGit], projectName)
}
