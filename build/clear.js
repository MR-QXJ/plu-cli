const fs = require('fs')
const path = require('path')

//编译时删除之前的bin目录
//已删除的ts文件编译时不会识别删除之前编译的，可能越积越多
deleteFolder(path.resolve('./bin'))

function deleteFolder(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file) => {
      const curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
