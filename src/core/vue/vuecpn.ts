import ora from 'ora'
import fs from 'fs'

import { config, targetRoot, resolveTmp } from 'config/global'
import { writeFileEjs } from 'utils/useEjs'
import { select, checkbox } from 'utils/useCmd'
import { compilePath, existsFileCover, resolve, errLog } from 'utils/tool'

import type { CommanderStatic } from 'commander'

interface fileCpnCommon {
  filePath: string
  cpnNameTmp: string
}

//公共组件ejs映射 - [描述: 目录名称]
const dirMap: keyMapStr = {
  '基于ant-design-vue': 'ant-design-vue',
  公共: 'common',
}
export function vuecpnCommand(program: CommanderStatic): void {
  program
    .command('vuecpn [cpnName]')
    .description('创建vue组件, vuecpn [cpnName] [-d cpnDir]')
    .action(async (cpnName: string) => {
      const { dest } = program.opts()
      if (cpnName) {
        createCpn(cpnName, dest)
      } else {
        const cpnDesc = await select(Object.keys(dirMap), '请选择组件类型:')
        createCpnCommon(dirMap[cpnDesc], dest)
      }
    })
}

/**
 * 生成初始组件
 * @param cpnName 自定义的组件名称
 * @param dest -d指定的存放目录
 */
async function createCpn(cpnName: string, dest?: string) {
  const spinner = ora(`创建${cpnName}${cpnName}组件...`)

  try {
    let targetDir: string = 'components'
    if (dest) {
      targetDir += `/${dest}`
    }
    spinner.start()

    const lowerName = cpnName.toLowerCase()

    const targetPath = resolve(targetRoot, targetDir)

    compilePath(targetPath)

    let filePath = resolve(targetPath, `${cpnName}.vue`)
    const proceed = await existsFileCover(filePath, spinner)

    if (proceed) {
      await writeFileEjs(resolve(resolveTmp, 'vue/cpn.ejs'), filePath, {
        name: cpnName,
        lowerName,
      })

      spinner.succeed(`创建成功: ${filePath}`)
    }
  } catch (err) {
    spinner.fail('创建失败')
    err && errLog(err)
  }
}

/**
 * 从公共组件目录选择生成组件
 * @param tmpDir
 * @param dest -d指定的存放目录
 */
async function createCpnCommon(tmpDir: string, dest?: string) {
  const spinner = ora(`创建公共组件...`)

  try {
    //选中类型下所有模板文件
    const tempFiles: string[] = fs.readdirSync(resolve(resolveTmp, 'vue', 'components', tmpDir))
    //选中类型下所有模板文件名称
    const tempFilesName = tempFiles.map((file) => file.split('.')[0])
    //目标文件夹
    const targetDir = `components/${config.commonComponentDir}${dest ? `/${dest}` : ''}`

    if (!tempFiles.length) throw Error('该项正在建设中，敬请期待...')

    //选中的模板文件名称
    const cpnNameTmps: string[] = await checkbox(tempFilesName, '请选择要添加的公共组件:')
    //选中的数量
    const checkLen: number = cpnNameTmps.length
    if (!checkLen) return

    spinner.start()

    const targetPath = resolve(targetRoot, targetDir)

    //上下文目录是否存在，不存在创建
    compilePath(targetPath)

    //询问已存在的同名文件是否覆盖
    let files: fileCpnCommon[] = []
    for (let i = 0; i < checkLen; i++) {
      const cpnNameTmp = cpnNameTmps[i]
      let filePath = resolve(targetPath, `${cpnNameTmp}.vue`)
      const proceed = await existsFileCover(filePath, spinner)

      if (proceed) {
        files.push({ filePath, cpnNameTmp })
      }
    }

    //创建允许的组件
    const fileLen = files.length
    for (let i = 0; i < fileLen; i++) {
      const { filePath, cpnNameTmp } = files[i]
      await writeFileEjs(resolve(resolveTmp, `vue/components/${tmpDir}/${cpnNameTmp}.ejs`), filePath)
    }

    spinner.succeed(`创建成功: ${cpnNameTmps.map((n) => (n += '.vue')).join('、')}`)
  } catch (err) {
    spinner.fail('创建失败')
    err && errLog(err)
  }
}
