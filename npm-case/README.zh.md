
此示例用于演示 Cocos Creator 中各种模块交互的情形，尤其是 NPM 模块的使用。

此 Cocos Creator 项目需要一些步骤来安装外部模块。

## 需要环境

- Node.js
- Visual Studio Code
- TypeScript
  
  在安装完 Node.js 之后在任意地方执行命令行 `npm install -g typescript`

## 设置步骤

当项目每次更改时，例如，当通过 git 更新该项目、清理过项目的临时文件后，需要执行以下步骤来安装外部模块。
以 `/npm-case/` 为当前目录，执行命令行：

- 执行 `npm install --no-save` 来安装 `node_modules/` 目录。

- 执行 `npm run build-proto` 会清理并重新生成 `Proto.js/` 目录下的 “proto”文件（用于 protobufjs 示例）。

除此之外不需要任何步骤，例如**不需要**手动清理 `node_modules/`。

此项目的验证标准是：

- 在执行上述的 `npm` 命令时没有任何错误，有普通的日志是正常的。

- 项目中唯一的空场景应该正常加载并且没有任何错误。

- 在**编辑器打开的情况**下，以 Visual Studio Code 打开 `/npm-case` 目录，并运行：
  `[Visual Studio Code 菜单栏]/[终端]/[运行任务]/[typescript]/[tsc:构建]`。
  之后 Visual Studio Code 的终端面板应该没有任何错误输出。