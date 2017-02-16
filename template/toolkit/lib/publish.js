/**
 */

'use strict';

module.exports = function (fie, options) {
    // 执行完publish命令的流程后,再调用一下这个
  options.callback && options.callback();
};
