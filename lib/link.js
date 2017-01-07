/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * 初始化读取package.json里面的 name,然后创建逻辑到fie插件目录
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */
'use strict';

const fs = require('fs');
const path = require('path');
const util = require('./util');

const cwd = process.cwd();

module.exports = function* (fie) {
  let name;
  let pkg;

  if (fs.existsSync(path.resolve(cwd, 'package.json'))) {
    pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
  } else {
    fie.logError('当前未找到 package.json 文件,请在 插件/套件 工程根目录里面执行此命令');
    fie.logError('软件创建失败');
    return;
  }

  if (!pkg.name) {
    fie.logError('无项目名');
    fie.logError('软件创建失败');
    return;
  }

  if (!util.isValidName(pkg.name)) {
    fie.logError('项目名不符合 插件/套件 规范, 必须以 @ali/fie-plugin- 或 @ali/fie-toolkit- 开头');
    fie.logError('软件创建失败');
    return;
  }

  const modulePath = fie.getFieModulesPath();
  if (!modulePath) {
    fie.logError('无法读取FIE 模块目录');
    fie.logError('软件创建失败');
    return;
  }

  // name = pkg.name.indexOf('@ali/') === 0 ? pkg.name : `@ali/${pkg.name}`;
  name = pkg.name;

  util.linkToFieHome(cwd, path.resolve(modulePath, name));
  fie.logSuccess(`软件创建成功, 链接到${modulePath}/${name}`);
};
