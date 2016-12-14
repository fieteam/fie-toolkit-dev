/**
 */
'use strict';

const toolUtil = require('./util');
const _ = require('underscore');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');

module.exports = function* (fie) {

  const answers = yield inquirer.prompt({
    type: 'list',
    name: 'name',
    message: '请选择你想要初始化的模板',
    choices: [
      {
        name: 'FIE 套件 ---- 用于生成项目模板',
        value: 'toolkit'
      },
      {
        name: 'FIE 插件 ---- 用于拓展FIE功能',
        value: 'plugin'
      }
    ]
  });

  const cwd = toolUtil.getCwd();
  const generateNames = toolUtil.generateNames(cwd.split(path.sep).pop());

  //
  //
  // //当前项目的根目录
  // var cwd = toolUtil.getCwd();
  // //当前项目名称集合
  // var generateNames = toolUtil.generateNames(cwd.split(path.sep).pop());
  // var config = fie.getModuleConfig();
  //
  // fie.dirCopy({
  //   src: toolUtil.getTemplateDir('root'),
  //   dist: cwd,
  //   data: _.extend({},config,generateNames),
  //   ignore: [
  //     'node_modules',
  //     'build',
  //     '.DS_Store',
  //     '.idea'
  //   ],
  //   filenameTransformer: function(name){
  //     if(name === '__gitignore') {
  //       name = '.gitignore';
  //     }else if(name === '__package.json') {
  //       name = 'package.json';
  //     }
  //     return name;
  //   }
  // });
  //
  // fie.logInfo('正在安装 tnpm 依赖...');
  // fie.tnpmInstall(function(err) {
  //   if (err) {
  //     fie.logError('tnpm 依赖安装失败');
  //     fie.logError('请手动执行 tnpm ii');
  //   } else {
  //
  //     console.log(chalk.yellow('\n--------------------初始化成功,请按下面提示进行操作--------------------\n'));
  //     console.log(chalk.green( chalk.yellow('$ fie start') +'         # 可一键开启项目开发环境' ));
  //     console.log(chalk.green( chalk.yellow('$ fie git create') +'    # 可自动在gitlab上创建仓库' ));
  //     console.log(chalk.green( chalk.yellow('$ fie git owner') +'     # 可将自己添加为仓库的master' ));
  //     console.log(chalk.green( chalk.yellow('$ fie help') +'          # 可查看当前套件的详细帮助' ));
  //     console.log(chalk.green('\n建议将现有初始化的代码提交一次到master分支, 方便后续切换到 '  + chalk.yellow('daily/x.y.z') +' 分支进行开发'));
  //     console.log(chalk.yellow('\n--------------------技术支持: @笑斌--------------------\n'));
  //
  //   }
  // });
};
