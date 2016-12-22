/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */

const path = require('path');
const request = require('request');
const fieEnv = require('fie-env');
const fs = require('fs');
const cwd = process.cwd();
const pkg = require(path.join(cwd, 'package.json'));

module.exports = function* (fie, options) {
  const isIntranet = fieEnv.isIntranet();

  const moduleName = pkg.name;

  pkg.description = 'delete';

  fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2));

  if (isIntranet) {
    try {
      request.get({
        url: `http://fie.alibaba.net/api/plugin-remove.do?name=${moduleName}`
      }, (err, httpResponse, body) => {
        body && (body = JSON.parse(body));
        if (err) {
          fie.logError(err);
        }
        if (body && body.errCode === 0) {
          fie.logSuccess('模块在官网中移除成功');
          options.callback && options.callback(null);
        } else {
          fie.logError('模块在官网中移除失败', body.errMsg);
          options.callback && options.callback('文档发布失败');
        }
      });
    } catch (err) {
      fie.logError(err);
    }
  }
};
