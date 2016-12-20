/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   擎空 <zhenwu.czw@alibaba-inc.com>
 *   笑斌 <xinlei.sxl@alibaba-inc.com>
 */

const path = require('path');
const request = require('request');
const cwd = process.cwd();
const pkg = require(path.join(cwd, 'package.json'));

module.exports = function* (fie, options) {
  // const moduleName = options.clientArgs.shift();

  // if (!moduleName || moduleName.toString().indexOf('@ali/fie-') !== 0) {
  //   fie.error('模块名格式错误,请填写模块全名 @ali/fie-xxx-yyy');
  //   return;
  // }

  const moduleName = pkg.name;

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
};
