
此示例用于演示 Cocos Creator 中各种模块交互的情形，尤其是 NPM 模块的使用。

此 Cocos Creator 项目需要一些步骤来安装外部模块：

- 运行 `npm install` 来安装 node modules。

- 运行 `npm run build-proto` 来重新生成“proto”文件（用于 protobufjs 示例）。

此项目的验证标准是：

- 项目中唯一的空场景应该正常加载并且没有任何错误。

- 用 Visual Studio Code 打开此项目，脚本中应该没有任何报错。