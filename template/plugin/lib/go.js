'use strict';

const api = require('fie-api');

const log = api.log('<{{%= fiePluginName %}}>');

module.exports = function* () {
  log.info('这是第一条插件命令');
};
