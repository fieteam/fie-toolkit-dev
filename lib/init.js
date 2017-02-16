'use strict';


const _ = require('underscore');
const inquirer = require('inquirer');
const path = require('path');
const fie = require('fie-api');
const toolUtil = require('./util');

const fieFs = fie.fs;
const log = fie.log('fie-toolkit-dev');
const npm = fie.npm;
const fieUser = fie.user;
const fieConfig = fie.config;
const fieEnv = fie.env;


const shortName = name => name.replace(/^(fie-)?((toolkit-)|(plugin-))/, '');

module.exports = function* () {
  const cwd = toolUtil.getCwd();
  const defaultName = shortName(path.basename(cwd));
  const answers = yield inquirer.prompt([{
    type: 'list',
    name: 'type',
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
    name: 'name',
    default: defaultName,
    message: '输入项目想要使用的名称'
  }]);

  answers.name = answers.name.replace(/^fie-/, '').replace(`${answers.type}-`, '');
  const config = fieConfig.get('toolkitConfig');
  // 生成的项目名称
  const isIntranet = fieEnv.isIntranet();
  const projectName = `fie-${answers.type}-${answers.name}`;
  const fullName = isIntranet ? `@ali/${projectName}` : projectName;
  const user = fieUser.getUser() || {};

  if (!toolUtil.isValidName(fullName)) {
    log.error(`项目名不符合 插件/套件 规范, 必须通过以下 ${isIntranet ? '@ali/' : ''}fie-plugin- 或 ${isIntranet ? '@ali/' : ''}fie-toolkit- 开头`);
    return;
  }

  fieFs.copyDirectory({
    src: toolUtil.getTemplateDir(answers.type),
    dist: cwd,
    data: _.extend({}, config, {
      author: user.name,
      email: user.email
    }, {
      packageJsonName: fullName,
      fiePluginName: projectName,
      fiePluginShortName: shortName(projectName)
    }),
    ignore: ['node_modules', 'build', '.DS_Store', '.idea', 'build'],
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
    log.success('插件创建成功');
  } else if (answers.name === 'toolkit') {
    log.success('套件创建成功');
  }

  // 执行软链操作
  const dist = toolUtil.linkToFieHome(cwd, fullName);
  log.success(`软件创建成功, 链接到${dist}`);


  // npm 依赖安装
  log.info('正在安装 npm 依赖...');
  try {
    yield npm.installDependencies();
  } catch (e) {
    log.error('tnpm 依赖安装失败');
    log.error('请手动执行 tnpm ii');
    log.debug(e);
  }
  log.success('tnpm 依赖安装成功');
  log.success(`${projectName}模块初始化成功`);
};
