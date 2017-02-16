# <{{%=fiePluginName%}}>

> 一句话描述插件作用

## 说明

说明一下插件的功能, 架构等

## 使用场景

描述一下插件的使用场景

## 安装

```
fie install plugin-<{{%=fiePluginShortName%}}>
```

## 参数配置

```
module.exports = {
  /* 其他配置... */
  <{{%=fiePluginShortName%}}>: {
    a: 3
  }
}
```


## 用法

### 初始化 eslint 配置 

#### 在命令行里面使用

```
$ fie <{{%=fiePluginShortName%}}> go
$ fie <{{%=fiePluginShortName%}}> help
```

#### 在套件/插件里面使用

```
const fieModule = require('fie-api').module;
const <{{%=fiePluginShortName%}}> = yield fieModule.get('plugin-<{{%=fiePluginShortName%}}>');
yield <{{%=fiePluginShortName%}}>.go(fie, {clientArgs: ['some-args'], clientOptions: { a: 2, b: 2}});
```

