>前端脚手架工具

## 发布 :fire:
- 使用verdaccio搭建npm私有仓库，保证依赖的安全性、私密性

- `npm run build`编译到**bin**目录后，具体发布流程可见: [verdaccio使用总结](http://183.230.162.215:8888/xuj/team/-/tree/master/03.%E4%B8%93%E4%B8%9A%E6%8A%80%E8%83%BD%E7%9F%A5%E8%AF%86/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%B8%93%E9%A2%98/npm%E5%BC%80%E5%8F%91%E4%B8%93%E9%A2%98/%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E6%90%AD%E5%BB%BA)
  
- 注意: 必须要配置verdaccio的端口监听 `listen` ，否则只能本机访问
  
- verdaccio当前已部署到159服务器，该网址能访问证明服务开启：[服务网址](http://192.168.16.159:4873/)    

  若verdaccio服务意外关闭，可进入该服务器在 **D:/verdaccio**目录下重新运行命令开启:

  ```shell
  verdaccio
  
  #服务器账户如下:
  ip: 192.168.16.159:8181
  accounr: Administrator 
  password: hh.89120862
  ```
  

使用步骤:

  - 安装nrm

     ```shell
    npm i nrm -g
     ```

  - 添加并使用npm私服镜像

    ```shell
    nrm add verdaccio http://192.168.16.159:4873/
    nrm use verdaccio
    ```

  - 安装脚手架工具

    ```shell
    npm i he-cli -g
    ```

  - 安装成功后执行`he -v`，出现版本号即可开始使用

>这里为私服ip，npm安装非私服的依赖时记得切换回对应镜像

## 指令 :dancer: 

- `he -v` 查看版本
- `he -h` 查看帮助
- `he create <项目名称>`  创建**新项目**，开始选择架构模板
- `he tool [-d 存放目录]`  选择并创建**js工具**到项目
  - `-d`可在**utils**下指定存放目录，不加默认是**utils/\***
- `he vuecpn [组件名] [-d 存放目录]`  
+ **带[组件名]**为**新增vue组件**(单个)。生成根目录在**components**，`-d`可在**components**下多指定一级存放目录
  
+ **不带[组件名]**为**公共组件**的选择生成(批量)。生成根目录在**components/common**下，`-d`可在**components/common**下多指定一级存放目录
- `he vuepage <页面名称> [-r]` 规定在**views/<页面名称>**目录下生成**vue页面组件**, 加`-r`同时生成对应路由文件**router.js**
- `he config`进行偏好设置,包括展示欢迎文本，公共组件生成的目录等

> 所有生成文件的目标路径默认从同级的**src**目录开始，没有**src**则从当前位置开始

## 开发 :maple_leaf:
- 没有`mode_modules`请先`npm i 安装依赖`

- `npm run build` 编译src下的ts文件**编译**到bin目录

- `npm start` **实时检测**src下的ts文件改动，并**编译**到bin目录

- `npm run lint` `eslintg`+`prettier`**校验代码**格式

- 开发环境测试: 编译后在项目根目录`npm link`添加成为全局指令, `npm unlink`卸载全局

  本地**修改源码**后:

  - 若已经`npm link`，一般只需要重新编译即可自动映射到全局

  - 若有包名或重要结构的修改，需要`npm unlink`删除全局映射, 重新`npm link`（如果重新`link`失败，需要手动删除node目录下对应**node_modules**和**cmd相关文件**）。

- 源码文件:

  - 偏好设置基于根目录**he.config.json**文件读写开发

  - **src/template**目录存放所有生成模板的ejs文件

## 注意事项 :see_no_evil:
> - 编译后生成bin目录再发布到npm
> - 需要npm安装依赖的git项目模板尽量有package-lock.json，可避免安装时出现意外
> - 注意git上的模板项目是否需要权限

## 工具概要 :cop: 

### 大纲

1. 以现有项目或可能用到的基本架构(端、框架、依赖、工具、公共组件)分成多组模板。通过指令选择自动下载，安装依赖，本地启动
2. 归纳一些零散的可能用到的工具、组件, 随时通过指令添加到项目中使用
3. 后续考虑针对比较典型的三方依赖，可通过指令快速引入到已有项目中，并可设计一些样式、代码的二次封装
4. 计划将特定业务逻辑页面代码，基于公共组件及架构，通过json配置生成(开发阶段定义未确定的配置未特定字段，成功后配合后端返回的字段进行替换)。
5. 结合实际项目需求及技术积累，不断迭代

### 形成指令

- 使用**shebang/hashbang** ：

  - 做法：在入口js文件顶部加上一行`#!/usr/bin/env node`，也可以写node的绝对路径，但不同系统有兼容问题。
  - 作用：执行入口文件时会在当前用户环境让node执行。

- package.json的**bin**属性对象添加`"key"(命令名称): "入口js路径"`

  设置命令名称及其入口


**执行外部指令**

使用node子进程模块`child_process`的`spawn`或`exec`方法在子进程执行任意命令(包括外部命令)，如利用`npm`安装依赖，并运行项目。

```js
const cp = spawn(cmd指令, [arg1, arg2...], {cwd: "需要cd进的目录"})
//在windows系统(process.platform === "win32")不会识别.cmd文件，指令后需要加上`.cmd`,其他系统不用加。
//例如: spawn("npm.cmd", ["run", "serve"], {cwd: "./demo1"})

//将子进程的打印和错误信息也展示在主进程中
cp.stdout.pipe(process.stdout) 
cp.stderr.pipe(process.stderr)
```

>模板项目运行成功后可以使用三方插件open打开游览器，但无法灵活操作跟选择端口；建议在项目模板webpack的配置运行时自动打开游览器

### 依赖类库

- **chalk**  修改控制台字符串样式

- **figlet** 控制台特殊风格文本

  ```js
  const {promisify} = require('util')
  const figlet = promisify(require('figlet'))
  const clear = require('clear')
  const chalk = require('chalk')
  const log = content => console.log(chalk.green(content))
  module.exports = async name => { 
      // 打印欢迎画⾯
      clear()
      const data = await figlet('Welcome') 
      log(data)
  }
  ```

- **clear**清理控制台

- **inquirer**命令行交互 - 选项、输入、确认询问等处理

- **ora** 加载状态动画

  ```js
  const ora = require("ora")
  const spinner = ora("downloading...") //加载文本
  spinner.start() //开始
  spinner.succeed("项目创建成功！") //成功
  spinner.fail("下载失败") //失败
  ```

- **commander**构建指令

  使用commander管理指令: `npm i commander `。后面统称导入的commander为**prg**

  - `prg.version(版本号, 指令)` 参数都是字符串。**版本号**可以从package.json中动态获取，相对路径必须要加`./`；多个**指令**用`,`分隔，且超过两个后面的无效，设置第二个参数*指令*后默认`-V --version`会失效。

  - 创建指令

    ```js
    //...表示有多个相关参数
    prg.command("create <单个参数名> [可选参数名...]")
    .description("指令描述")
    .action((arg1, arg2) => {
      ...
    })
    ```

  - `prg.options("-选项1 --选项2... <必须参数名> [可选参数名]", 描述)`设置指令选项,

    - 旧版通过`prg.选项2`获取到参数

    - 新版(7.2.0)通过`prg.opts()`获取参数。

    - 还可通过 `prg.on('option:选项2', callback(参数))`监听指令。只能监听到一个参数

  - `prg.parse(process.argv)` 通过指令解析执行上面定义的相关进程

- **download-git-repo**从git远程库上下载项目模板

  ```js
  //path需要查看官方指定的格式:
  download(path, targetDir, options, callback)
  ```

  node的**util**模块可以导入`{ promisify }`，将回调方式的方法包装成为`promise`方式

  - 从github拉取: `download(github:owner/project-name#branch, projectName)`
  - 从gitlab拉取: `download(direct:gitlab地址/owner/project-name.git#branch, projectName)`

  >options中clone: true会拉取模板git信息,但由于权限问题非公开账号很容易failed 128；使用clone: true方式网址最后最好加上后缀`.git`。
