import fs from 'fs'

import ora from 'ora'

import { config, targetRoot, resolveTmp } from 'config/global'
import { writeFileEjs } from 'utils/useEjs'
import { select } from 'utils/useCmd'
import { compilePath, existsFileCover, resolve, errLog } from 'utils/tool'

import type { CommanderStatic } from 'commander'

//读取所有工具模板文件名(去掉后缀)
const tmpDir: string[] = fs.readdirSync(resolve(resolveTmp, 'js'))
const tools = tmpDir.map((file) => file.split('.')[0])

export function toolCommand(program: CommanderStatic): void {
  program
    .command('tool')
    .description('创建js工具, tool [-d toolPath]')
    .action(async () => {
      const toolName: string = await select(tools, '请选择要添加的js工具:')
      const spinner = ora(`创建${toolName}.js...`)
      try {
        spinner.start()

        const dest: string = program.opts().dest

        const targetDir = dest ? `utils/${dest}` : `utils`
        const targetPath = resolve(targetRoot, targetDir)

        compilePath(targetPath)

        const filePath = resolve(targetPath, `${toolName}.js`)
        const proceed = await existsFileCover(filePath, spinner)

        if (proceed) {
          await writeFileEjs(resolve(resolveTmp, `js/${toolName}.ejs`), filePath)

          spinner.succeed(`创建成功: ${filePath}`)
        }
      } catch (err) {
        spinner.fail('创建失败')
        err && errLog(err)
      }
    })
}
