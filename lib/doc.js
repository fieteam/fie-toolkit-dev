/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * 将文档同步到 fie 官网
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */

'use strict';

const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const util = require('./util');
const request = require('co-request');
const semver = require('semver');
const querystring = require('querystring');
const fie = require('fie-api');

const log = fie.log('fie-toolkit-dev');
const fieEnv = fie.env;

/**
 * 获取当前分支
 * @returns {boolean}
 */
function getCurBranch() {
  const headerFile = path.join(cwd, '.git/HEAD');
  const gitVersion = fs.existsSync(headerFile) && fs.readFileSync(headerFile, { encoding: 'utf8' });
  const arr = gitVersion ? gitVersion.split(/refs[\\/]heads[\\/]/g) : [];
  const v = arr.length > 1 ? arr[1] : '';
  return v.trim();
}

function syncPackageVersion(pkg) {
  let branch = getCurBranch();
  branch = branch.replace('daily/', '');
  // 判断一下 是否是标准的 x.y.z格式
  if (semver.valid(branch)) {
    pkg.version = branch;
    fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
    return branch;
  }
  return '';
}


module.exports = function* () {
  // return new Promise((resolve, reject) => {
  let pkg;
  const readmePath = path.join(cwd, 'README.md');
  let i;
  let matchVersionLog = false;

  // 验证package.json的存在
  try {
    pkg = require(path.resolve(cwd, 'package.json'));
  } catch (err) {
    log.error('当前未找到 package.json 文件,请在 插件/套件 工程根目录里面执行此命令');
    // reject(err);
    return false;
  }

  // 将分支的版本号同步到package.json
  const version = syncPackageVersion(pkg);
  if (version) {
    log.success(`成功将package.json中的版本号同步为${version}`);
  }

  // 验证项目名是否合法
  if (!util.isValidName(pkg.name)) {
    log.error('项目名不符合 插件/套件 规范, 必须以 @ali/fie-plugin- 或 @ali/fie-toolkit- 开头');
    // reject(true);
    return false;
  }

  // 验证是否有 readme.md 文件
  if (!fs.existsSync(readmePath)) {
    log.error('缺少 README.md 文件(注意文件名大小写)');
    // reject(true);
    return false;
  }

  // 是否有填写版本号
  if (!pkg.version) {
    log.error('package.json 中 version 字段未填写');
    // reject(true);
    return false;
  }

  // 是否有填写描述信息
  if (!pkg.description) {
    log.error('package.json 中 description 字段未填写');
    // reject(true);
    return false;
  }

  // 是否填写了 changeLog
  if (!pkg.changeLog) {
    log.error('package.json 无 changeLog 字段');
    // reject(true);
    return false;
  } else if (!Array.isArray(pkg.changeLog)) {
    log.error('package.json 无 changeLog 必须为数组类型,如: [{"version":"x.x.x","log":["msg1","msg2"]}]');
    // reject(true);
    return false;
  }
  for (i = 0; i < pkg.changeLog.length; i += 1) {
    if (pkg.changeLog[i].version === pkg.version) {
      if (!Array.isArray(pkg.changeLog[i].log) || pkg.changeLog[i].log.length === 0) {
        log.error(`changeLog[${i}].log 不是数组,或长度为0`);
          // reject(true);
        return false;
      }
      matchVersionLog = true;
    }
  }
  if (!matchVersionLog) {
    log.error(`未填写 ${pkg.version} 对应的更新日志`);
      // reject(true);
    return false;
  }


  // 验证是否有维护者信息
  if (!pkg.maintainers || !pkg.maintainers.length) {
    log.error('package.json 中 maintainers 数组未填写, 请以 {name:xxx, mail: xxx} 的格式填写每一条信息');
    // reject(true);
    return false;
  }

  return true;
};
