'use strict';

const log = require('fie-log')('<{{%= fiePluginName %}}>');

module.exports = function* () {
  log.info('这是第一条插件命令');
};
