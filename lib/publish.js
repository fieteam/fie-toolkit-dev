/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */


const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const doc = require('./doc');
const fieEnv = require('fie-env');
const spawn = require('cross-spawn');

const cwd = process.cwd();

function runInit(fie, git, changeLog, publishLocation) {
  // 发布之后同步一下版本号
  git(fie, {
    clientArgs: ['release', '-m', changeLog],
    callback(err) {
      if (err) {
        fie.logError('git推送失败');
        // reject(err);
        return;
      }
      fie.logSuccess('git推送成功');


      // 同步完之后发布tnpm
      if (publishLocation == 'tnpm') {
        spawn('tnpm', ['publish'], { stdio: 'inherit' });
      } else if (publishLocation == 'npm') {
        spawn('npm', ['publish'], { stdio: 'inherit' });
      }

      // fie.getFieModule('fie-plugin-tnpm', (err, tnpm) => {
      //   tnpm(fie, {
      //     clientArgs: ['publish'],
      //     callback() {
      //       // tnpm发布之后,同步一下用户
      //       tnpm(fie, {
      //         clientArgs: ['sync'],
      //         callback() {
      //           // resolve();
      //           fie.logSuccess('发布成功,所有操作完成!');
      //         }
      //       });
      //     }
      //   });
      // });
    }
  });
}

module.exports = function* (fie) {
  const isIntranet = fieEnv.isIntranet();
  let err;

  // 如果有.git 就提交git
  if (!fs.existsSync(path.resolve(cwd, '.git'))) {
    fie.logError('您尚未新建gitlab仓库');
    return;
  }

  if (isIntranet) {
    yield doc(fie);
  }

  fie.getFieModule('fie-plugin-git', (err, git) => {
    // 执行 doc 函数时就已经会对 pkg 及 changeLog 的存在性做了检查了,这里不在重复
    let changeLog;
    let message;
    const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
    const version = pkg.version.split('.');

    for (let i = 0; i < pkg.changeLog.length; i++) {
      if (pkg.changeLog[i].version === pkg.version) {
        changeLog = pkg.changeLog[i].log.join(',');
        break;
      }
    }

    // 版本号提示判断
    if (version[2] == 0) {
      runInit(fie, git, changeLog, 'tnpm');
      return;
    } else if (version[2] == 1) {
      message = `当前发布的版本是 ${pkg.version} ,请确保向下兼容 ${`${version[0]}.${version[1]}.0`} , 确认兼容请输入(y)继续操作`;
    } else {
      message = `当前发布的版本是 ${pkg.version} ,请确保向下兼容 ${`${version[0]}.${version[1]}.0`} ~ ${`${version[0]}.${version[1]}.${parseInt(version[2], 10) - 1}`} , 确认兼容请输入(y)继续操作`;
    }

    // 发布时,提示一下当前版本
    inquirer.prompt([
      {
        type: 'input',
        name: 'check',
        message
      },
      {
        type: 'list',
        name: 'publishLocation',
        message: '你想要发布到哪里呢?',
        choices: ['tnpm', 'npm']

      }
    ]).then((answers) => {
      if (answers.check === 'y' || answers.check === 'Y') {
        runInit(fie, git, changeLog, answers.publishLocation);
      }
    });
  });
  // });
};

