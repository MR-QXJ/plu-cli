import fs from 'fs'
import { resolve } from 'utils/tool'

//读取默认配置
export const config = require('../../he.config.json')

//template目录绝对路径 (ejs不会被tsc编译, bin目录下不会有)
export const resolveTmp = resolve(__dirname, '../../src/template')

//生成根目录
export const targetRoot = fs.existsSync('./src') ? './src' : ''

//npm指令，根据平台不同
export const npm: string = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const vueTmpUrl = 'direct:http://183.230.162.215:8888/fe/cli-template-vue.git'
const uniTmpUrl = 'direct:http://183.230.162.215:8888/fe/cli-template-uni-app.git'

//git模板地址(download-git-repo)
//vue项目
export const gitMapVue: keyMapStr = {
  'ant-design-vue': `${vueTmpUrl}#master`,
  vant: `${vueTmpUrl}#vant`,
  'vant-app': `${vueTmpUrl}#vant-app`,
  element: `${vueTmpUrl}#element`,
}

//uni-app项目
export const gitMapUni: keyMapStr = {
  uview: `${uniTmpUrl}#master`,
}
