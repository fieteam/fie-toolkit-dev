/**
 * 打开服务器
 */

'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const open = require('open');

module.exports = function (fie, options) {
  const sdkConfig = fie.getModuleConfig();

  if (!fs.existsSync(path.resolve(process.cwd(), 'webpack.config.js'))) {
    fie.logError('未发现 webpack.config.js 文件, 可以使用 fie add conf 添加对应版本 webpack 配置文件');
    return;
  }

  process.env.DEV = 1;
  process.env.LIVELOAD = sdkConfig.liveload ? 1 : 0;
  spawn('./node_modules/.bin/webpack-dev-server', [
    '--config',
    './webpack.config.js',
    '--port',
    sdkConfig.port
  ], { stdio: 'inherit' });

  if (sdkConfig.open) {
    // 开服务器比较慢,给它留点时间buffer
    setTimeout(() => {
      open(`http://127.0.0.1:${sdkConfig.port}/${sdkConfig.openTarget}`);
    }, 500);
  }

  options.callback && options.callback();
};
