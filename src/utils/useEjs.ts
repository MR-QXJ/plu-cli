import fs from 'fs'
import { promisify } from 'util'

import { renderFile } from 'ejs'

//promise包装的ejs renderFile
//promisify<arg1, arg2, result>包装函数的参数与结果类型
const ejsRenderFile = promisify<string, ejsCpnData, string>(renderFile)

/**
 * 根据模板生成文件
 * @param tmpPath 模板路径
 * @param filePath 生成路径
 * @param data 模板数据
 */
export async function writeFileEjs(tmpPath: string, filePath: string, data?: ejsCpnData): Promise<void> {
  const file = await ejsRenderFile(tmpPath, data || {})
  if (!file) throw Error('模板生成错误')

  fs.writeFileSync(filePath, file)
}
