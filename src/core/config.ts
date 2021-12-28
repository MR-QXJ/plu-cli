import { config } from 'config/global'
import { warnLog, changeConfig, getType } from 'utils/tool'
import { select, confirm, input } from 'utils/useCmd'

import type { CommanderStatic } from 'commander'

//配置key描述映射 - [描述: he.config.json中对应的key]
const configMap: keyMapStr = {
  运行时展示欢迎文本: 'showWelcome',
  自动安装项目依赖: 'autoInstall',
  尽可能自动启动项目: 'autoStart',
  公共组件生成目录: 'commonComponentDir',
}

export function configCommand(program: CommanderStatic): void {
  program
    .command('config')
    .description('配置默认偏好, config')
    .action(async () => {
      const desc = await select(Object.keys(configMap), '请选择偏好配置项:')
      const key = configMap[desc]
      const val = config[key]
      const valType = getType(val)
      if (valType === 'boolean') {
        //布尔值 - 确认方式
        const res = await confirm(`是否${val ? '关闭' : '开启'}此项 - ${desc}?`)
        if (res) {
          changeConfig(key, !val)
        }
        return
      }
      if (valType === 'string') {
        //字符串 - 输入方式
        const res = await input(`当前${desc}为 - ${val}，请输入新的设置：`)
        if (res) {
          changeConfig(key, res)
        } else {
          warnLog('输入不能为空!')
        }
        return
      }
    })
}
