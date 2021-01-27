# NPM 测试例

此示例用于演示 Cocos Creator 中各种模块交互的情形，尤其是 NPM 模块的使用。

此 Cocos Creator 项目需要一些步骤来安装外部模块。

## 测试环境

- Node.js
- Visual Studio Code（推荐、可选）

## 设置步骤

当项目每次更改时，例如，当通过 git 更新该项目、清理过项目的临时文件后，需要执行以下步骤来安装外部模块。
以 `/npm-case/` 为当前目录，执行命令行：

- 执行 `npm install --no-save` 来安装 `node_modules/` 目录。

除此之外不需要任何步骤，例如**不需要**手动清理 `node_modules/`。

此项目的验证标准是：

- 在执行上述的 `npm` 命令时没有任何错误，有普通的日志是正常的。

- 项目中唯一的空场景应该正常加载和显示，如果目标平台有控制台，那么控制台应该没有任何错误。

- 项目中的 TypeScript 代码应该没有任何错误提示。可选择以下两种方式验证，⚠ 以下两种方式都要求 **在编辑器打开的情况下进行**：
    - 在 Visual Studio Code 中打开 `/npm-case` 目录，并运行：
    `[Visual Studio Code 菜单栏]/[终端]/[运行任务]/[typescript]/[tsc:构建]`。
    之后 Visual Studio Code 的终端面板应该没有任何错误输出。

    - 运行命令行并切换至 `/npm-case` 目录，并运行：
    ```bash
    npx tsc
    ```
    命令行应该没有任何输出。