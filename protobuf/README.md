

本案例演示了如何在 Cocos Creator 3D 来使用 protobuf.js。

## 游戏场景

游戏场景模拟了 protobuf 消息的编码和解码：当**点击**一个模型时，会向场景里其它的模型随机发送一条 protobuf 编码的消息，接收者在解码后显示出来。

## 目录结构

- `assets/thirdy` 存放了 `protobuf.js`、`long.js` 两个库的库文件
- `assets/proto/awesome.js` 和 `assets/proto/awesome.d.ts` 是 `protos/awesome.proto` 用 `pbts`、`pbjs` 生成的数据定义文件，具体的生成命令请查看 `tools/compile-proto/package.json`。 

## 更新 proto 文件

更新之前请先确保运行过 install：
```bash
> cd tools/compile-proto
> npm install
```

而后，每次更新 proto 文件后执行下面的命令来更新：
```bash
> cd tools/compile-proto
> npm run build-proto
```

## 注意事项

- 确保 `protobuf.js`、`long.js` 以及生成的 `awesome.js` 之间设置了正确的依赖关系。

- 我们将生成的 `awesome` 包对象放到了全局命名空间中，我们的处理在 `tools/compile-proto/wrap-pbjs.js` 和 `tools/compile-proto/wrap-pbts.js` 中。于是在项目脚本中可以直接引用：
```ts
awesome.AwesomeMessage
```