'use strict';

const chalk = require('chalk');

module.exports = function* () {
  const help = [
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
};
