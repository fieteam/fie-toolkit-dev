

const chalk = require('chalk');

module.exports = function () {
  const help = [
    '',
    'fie-toolkit-dev 使用帮助:  $ fie dev [command]',
    '',
    '  $ fie link                # 链接当前目录至本地fie仓库',
    '  $ fie doc                 # 同步本地文档至fie网站',
    '  $ fie publish             # 发布项目至tnpm',
    '  $ fie unpublish           # 将本项目从fie网站上去除',
    '  $ fie help                # 显示套件帮助信息',
    '',
    '更详细的帮助信息可查看:  http://web.npm.alibaba-inc.com/package/@ali/fie-toolkit-dev',
    ''
  ].join('\r\n');

  process.stdout.write(chalk.green(help));
};
