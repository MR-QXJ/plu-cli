//映射索引签名 - 字符串
interface keyMapStr {
  [key: string]: string
}
//框架选项索引签名
interface fkKey {
  [tmp: string]: (projectName: string) => Promise<void>
}
