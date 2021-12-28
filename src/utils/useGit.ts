import ora from 'ora'

import { log, warnLog, errLog } from 'utils/tool'

const download = require('download-git-repo')

/**
 * 从git下载项目模板
 * @param targetGit 模板地址
 * @param projectName 项目名
 */
export function downloadGit(targetGit: string, projectName: string): Promise<boolean> {
  const spinner = ora('downloading...')

  return new Promise((resolve, reject) => {
    if (!targetGit) {
      reject()
      return warnLog('未知的项目类型，请重试~')
    }
    log('正在创建项目，请稍后...')
    spinner.start()
    download(targetGit, projectName, { clone: true }, (err: Error) => {
      if (err) {
        spinner.fail('创建失败')
        errLog(err)
        return reject()
      }
      spinner.succeed('项目创建成功！')
      resolve(true)
    })
  })
}
