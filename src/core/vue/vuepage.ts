import ora from 'ora'

import { targetRoot, resolveTmp } from 'config/global'
import { writeFileEjs } from 'utils/useEjs'
import { compilePath, existsFileCover, resolve, errLog } from 'utils/tool'

import type { CommanderStatic } from 'commander'

export function vuepageCommand(program: CommanderStatic): void {
  program
    .command('vuepage <pageName>')
    .description('创建vue页面, vuepage <pageName> [-r]')
    .action(async (pageName: string) => {
      const isRoute = program.opts().route

      const spinner = ora(`创建${pageName}页...`)
      try {
        spinner.start()
        const lowerName = pageName.toLowerCase()
        const targetPath = resolve(targetRoot, `views/${pageName}`)

        compilePath(targetPath)

        const pageFilePath = resolve(targetPath, `${pageName}.vue`)
        const routerFilePath = resolve(targetPath, 'router.js')

        const writeFiles = [
          {
            path: pageFilePath,
            ejs: 'cpn.ejs',
          },
        ]
        isRoute &&
          writeFiles.push({
            path: routerFilePath,
            ejs: 'router.ejs',
          })

        const proceed =
          (isRoute &&
            (await existsFileCover(pageFilePath, spinner)) &&
            (await existsFileCover(routerFilePath, spinner))) ||
          (await existsFileCover(pageFilePath, spinner))

        if (proceed) {
          const data = { name: pageName, lowerName }

          for (const { path, ejs } of writeFiles) {
            await writeFileEjs(resolve(resolveTmp, `vue/${ejs}`), path, data)
          }

          spinner.succeed(`创建成功: ${targetPath}`)
        }
      } catch (err) {
        spinner.fail('创建失败')
        err && errLog(err)
      }
    })
}
