'use strict';

var chalk = require('chalk');

var Commands = {

  go: function(fie) {
    fie.logInfo('第一条命令');
  },

  help: function() {

    var help = [
      '',
      '<{{%= fiePluginName %}}> 插件使用帮助:',
      ' $ fie <{{%= fiePluginShortName %}}> go           第一条命令',
      ' $ fie <{{%= fiePluginShortName %}}> help           查看帮助信息',
      '',
      '关于 <{{%= fiePluginName %}}> 插件的配置可查看: http://web.npm.alibaba-inc.com/package/@ali/<{{%= fiePluginName %}}>',
      '',
      ''
    ].join('\r\n');

    process.stdout.write(chalk.magenta(help));

  }
};

/**
 * @param fie fie接口集合
 * @param options
 * @param options.clientArgs , 若用户输入 fie <{{%= fiePluginShortName %}}> nnn -m xxxx 则 cliArgs为 [ 'nnn', '-m', 'xxxx']
 * @param options.pluginConfig 强制重置 fie.config.js 里面的参数,如果有传入的值,则优先使用这个,在被其他插件调用的时候可能会传入
 * @param options.callback 操作后的回调, 在被其他插件调用时,可能会传入
 */
module.exports = function(fie, options) {

  var commandMethod = options.clientArgs.splice(0, 1).pop() || '';

  options.callback = options.callback || function() {};

  if (Commands[commandMethod]) {
    Commands[commandMethod](fie, options);
  } else {
    console.log(chalk.magenta('\r\n命令fie <{{%= fiePluginShortName %}}>' + commandMethod + '不存在, 可以使用以下命令:'));
    Commands.help();
  }
};
