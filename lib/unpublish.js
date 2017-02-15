/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   擎空 <zernmal@foxmail.com>
 *   笑斌 <joshuasui@163.com>
 */
'use strict';

const path = require('path');
const request = require('co-request');
const fieEnv = require('fie-env');
const fs = require('fs');
const log = require('fie-log')('fie-toolkit-dev');



module.exports = function* (fie, options) {
  const isIntranet = fieEnv.isIntranet();

  const moduleName = pkg.name;
  const cwd = process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));

  pkg.description = 'delete';

  fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2));

  if (isIntranet) {
    try {
      yield request.get({
        url: `http://fie.alibaba.net/api/plugin-remove.do?name=${moduleName}`
      }, (err, httpResponse, body) => {
        body && (body = JSON.parse(body));
        if (err) {
          log.error(err);
        }
        if (body && body.errCode === 0) {
          log.success('模f块在官网中移除成功');
          options.callback && options.callback(null);
        } else {
          log.error('模块在官网中移除失败', body.errMsg);
          options.callback && options.callback('文档发布失败');
        }
      });
    } catch (err) {
      log.error(err);
    }
  }
};
