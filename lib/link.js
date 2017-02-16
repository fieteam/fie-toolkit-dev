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
const log = require('fie-log')('fie-toolkit-dev');
const fieEnv = require('fie-env');

const cwd = process.cwd();

module.exports = function* () {
  if (!fs.existsSync(path.resolve(cwd, 'package.json'))) {
    log.error('当前未找到 package.json 文件,请在 插件/套件 工程根目录里面执行此命令');
    log.error('软件创建失败');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
  const isIntranet = fieEnv.isIntranet();

  if (!pkg.name) {
    log.error('无项目名');
    log.error('软件创建失败');
    return;
  }

  if (!util.isValidName(pkg.name)) {
    log.error(`项目名不符合 插件/套件 规范, 必须通过以下 ${isIntranet? '@ali/': ''}fie-plugin- 或 ${isIntranet? '@ali/': ''}fie-toolkit- 开头`);
    log.error('软件创建失败');
    return;
  }

  const dist = util.linkToFieHome(cwd, pkg.name);
  log.success(`软件创建成功, 链接到${dist}`);
};
