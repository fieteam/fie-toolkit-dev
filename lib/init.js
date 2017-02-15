const toolUtil = require('./util');
const _ = require('underscore');
const inquirer = require('inquirer');
const fieFs = require('fie-fs');
const log = require('fie-log');
const npm = require('fie-npm');
const fieConfig = require('fie-config');

module.exports = function* () {
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
  const config = fieConfig.get('toolkitConfig');
  // 生成的项目名称
  const projectName = `fie-${answers.name}-${answers.projectName}`;

  fieFs.copyDirectory({
    src: toolUtil.getTemplateDir(answers.name),
    dist: cwd,
    data: _.extend({}, config, {
      fiePluginName: projectName,
      fiePluginShortName: projectName.replace('@ali/', '').replace('fie-plugin-', '').replace('fie-toolkit-', '')
    }),
    ignore: ['node_modules', 'build', '.DS_Store', '.idea', 'build'],
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
    log.success('插件创建成功');
  } else if (answers.name === 'toolkit') {
    log.success('套件创建成功');
  }

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
