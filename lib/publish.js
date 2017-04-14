/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const doc = require('./doc');
const spawn = require('cross-spawn');
const fie = require('fie-api');

const log = fie.log('fie-toolkit-dev');
const fieModule = fie.module;
const fieEnv = fie.env;

let fieInstance = {};

const cwd = process.cwd();

function* runInit(changeLog) {
  const git = yield fieModule.get('fie-plugin-git');
  // 发布之后同步一下版本号
  yield git.publish(fieInstance, {
    clientArgs: [],
    clientOptions: {
      m: changeLog,
      tag: true
    }
  });
  log.success('git推送成功');

  // 同步完之后发布 npm
  spawn('npm', ['publish'], { stdio: 'inherit' });
}

module.exports = function* (_fie) {
  fieInstance = _fie;

  // 如果有.git 就提交git
  if (!fs.existsSync(path.resolve(cwd, '.git'))) {
    log.error('您尚未新建gitlab仓库');
    return;
  }

  const docRes = yield doc();
  
  if (!docRes) {
    return false;
  }

  // 执行 doc 函数时就已经会对 pkg 及 changeLog 的存在性做了检查了,这里不在重复
  let changeLog;
  let message;
  const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
  const version = pkg.version.split('.');

  for (let i = 0; i < pkg.changeLog.length; i += 1) {
    if (pkg.changeLog[i].version === pkg.version) {
      changeLog = pkg.changeLog[i].log.join(',');
      break;
    }
  }

  // 版本号提示判断
  if (version[2] === 0) {
    yield runInit(changeLog);
    return;
  } else if (version[2] === 1) {
    message = `当前发布的版本是 ${pkg.version} ,请确保向下兼容 ${`${version[0]}.${version[1]}.0`} , 确认兼容请输入(y)继续操作`;
  } else {
    message = `当前发布的版本是 ${pkg.version} ,请确保向下兼容 ${`${version[0]}.${version[1]}.0`} ~ ${`${version[0]}.${version[1]}.${parseInt(version[2], 10) - 1}`} , 确认兼容请输入(y)继续操作`;
  }

  // 发布时,提示一下当前版本
  const answers = yield inquirer.prompt([{
    type: 'input',
    name: 'check',
    message
  }]);

  if (answers.check === 'y' || answers.check === 'Y') {
    yield runInit(changeLog);
  }
};

