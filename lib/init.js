/**
 */
'use strict';

const toolUtil = require('./util');
const _ = require('underscore');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');

module.exports = function* (fie) {

  const cwd = toolUtil.getCwd();

  const answers = yield inquirer.prompt([{
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
  }, {
    type: 'input',
    name: 'projectName',
    message: '输入项目想要使用的名称'
  }]);

  const generateNames = toolUtil.generateNames(cwd.split(path.sep).pop());
  const config = fie.getModuleConfig();

  // 生成的项目名称
  const projectName = `fie-${answers.name}-${answers.projectName}`;

  fie.dirCopy({
    src: toolUtil.getTemplateDir(answers.name),
    dist: cwd,
    data: _.extend({}, config, {
      fiePluginName: projectName,
      fiePluginShortName: projectName.replace('@ali/', '').replace('fie-plugin-', '').replace('fie-toolkit-', '')
    }),
    ignore: [
      'node_modules',
      'build',
      '.DS_Store',
      '.idea',
      'build'
    ],
    sstrReplace: [{
      str: 'developing-fie-plugin-name',
      replacer: projectName
    }],
    templateSettings: {
      evaluate: /<{{%([\s\S]+?)%}}>/g,
      interpolate: /<{{%=([\s\S]+?)%}}>/g,
      escape: /<{{%-([\s\S]+?)%}}>/g
    },
    filenameTransformer(filename) {
      if (filename === '_gitignore') {
        filename = '.gitignore';
      }
      return filename;
    }
  });

  if (answers.name === 'plugin') {
    fie.logSuccess('插件创建成功');
  } else if (answers.name === 'toolkit') {
    fie.logSuccess('套件创建成功');
  }

  fie.logInfo('正在安装 tnpm 依赖...');
  fie.tnpmInstall({}, (err) => {
    if (err) {
      fie.logError('tnpm 依赖安装失败');
      fie.logError('请手动执行 tnpm ii');
    } else {
      fie.logSuccess('tnpm 依赖安装成功');
      fie.logSuccess(`${projectName}模块初始化成功`);
    }
  });

};
