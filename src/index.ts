#!/usr/bin/env node
require('module-alias/register')

import program from 'commander'

import { config } from 'config/global'
import { configCommand } from 'core/config'
import { creartCommand } from 'core/create'
import { toolCommand } from 'core/js/jsTool'
import { vuecpnCommand } from 'core/vue/vuecpn'
import { vuepageCommand } from 'core/vue/vuepage'
import { figLog } from 'utils/tool'

const packageJSON = require('../package.json')

configCommand(program)
creartCommand(program)
toolCommand(program)
vuecpnCommand(program)
vuepageCommand(program)

config.showWelcome && figLog('Welcome to he-cli')

program
  .version(packageJSON.version, '-v, --version')
  .option('-d --dest <destDir>', '指定部分指令(vuecpn、tool)创建文件的子目录')
  .option('-r --route', '新建页面(vuepage)时添加对应路由文件')
  .parse(process.argv)
