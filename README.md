# fie-toolkit-dev

> 快速生成 fie 插件和套件

## 说明

用于生成 fie 插件和套件的工具

## 用法

### 初始化

```
fie init dev 
```

### 创建软链

在当前正在开发的插件或套件根目录下执行以下命令后, 之后你在本机操作的所有关于该套件或插件的命令,都是在执行你当前项目的代码

```
fie link
```

### 发布代码

发布代码至 npm 上, 发布前会对文档进行简单的检查

```
fie publish
```


### 查看帮助信息

```
fie help
```

## 套件插件开发推荐实践方案

## 使用最新的 fie-toolkit-dev 初始化

该套件会已经整合了以下所有的推荐实践方案, 并且已经处理好了所有套件, 插件的 eslint 的校验问题.

### 所有 API 都通过 [fie-api](https://github.com/fieteam/fie/tree/master/packages/fie-api) 来调用

FIE 早期设计是将 fie 对外提供的的 API 集合成一个对象, 在调用套件或插件的方法以第一个参数的形式传进去的, 现在,为了 API 的规范性及版本的灵活性,我们将其搜成一个独立的 npm 包.

大家在需要调用 API 的时候直接调用 `fie-api` 的内容就好, 这样 API 也不用跟着用户的 fie 版本走,直接在插件或套件里面指定安装对应的 API 版本就行, [文档请见这里](https://github.com/fieteam/fie/tree/master/packages/fie-api).

### 使用 generator 避免回调地狱

FIE 早期由于考虑低版 nodeJs , 套件全部未使用 generator 或 async 等方案,后面随着 nodeJs 高版本普及后, 我们在内部全部支持了 generator 的写法. 具体写法如下:

```
const api = require('fie-api);

const fieModule = api.module;

// 假定以下函数是套件的 publish 命令实现
module.exports = function*(_fie) {
  // 获取 git 插件模块
  const git = yield fieModule.get('plugin-git');
  
  // 执行 git 插件同步分支版本号命令
  yield git.sync(_fie);
  
  // 执行 git 插件的 push 命令
  yield git.push(_fie);
}

```

### 插件对外暴露对象

插件最开始是为了开发解决一类开发场景工具而提供的, 最开发认为插件应该就是一个简单的命令, 所以要求插件对外露一个函数.

但实际开发中,发现插件其实也是有多个命令的, 比如 `fie-plugin-git` 就有 `sync` `push` 等多个命令. 所以,我们要求插件对外也要暴露一个对象.

如果无子命令就可以执行的,可以给 `default` 属性传一个默认命令, 具体代码如下:

```
// 假定以下为 fie-plugin-commit 插件逻辑

function* commit() {
  // 执行弹出 commit 类型选择框操作
}

function* help() {
  // 打印帮助信息
}

module.exports = {
  help,
  default: commit
}
```


### 获取命令行参数

新版 fie 会将所有命令行的参数和选项通过命令函数的第二个参数传进来. 第二个参数是一个 object ,

会有 `clientArgs` 和 `clientOptions` 两个属性, 前者是控制台参数数组, 后者是控制台选项对象, 具体使用如下:

```
// 假定以下为 fie commit help 命令的实现
// 第一个参数是旧版 fie 对插件套件暴露的接口对象,不推荐使用, 请使用 [fie-api](https://github.com/fieteam/fie/tree/master/packages/fie-api) 替代
// 第二个参数是控制台参数及选项
module.exports = function*(_fie, options) {
  console.log(options.clientArgs);
  console.log(options.clientOptions);
}

// 执行 fie commit help --x 1
// 那么将会输出:  
// ['help']
// { x: 1 }
```

### 共建套件和插件

如果您有一套不错的开发模式或小工具想推荐给身边的同事使用,开发一个 fie 套件或插件是一个很不错的方式.

在您开发 fie 前,请务必先查看目前是否已经有跟您的解决问题相似的套件或插件了, 若已经有了,您可以考虑加入该套件的开发,一起优化现有的模块.
