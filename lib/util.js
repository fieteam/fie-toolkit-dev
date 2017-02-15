'use strict';

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const templateDir = path.resolve(__dirname, '../template/');
const cwd = process.cwd();

function firstUpperCase(str) {
  return str.replace(/^\S/, s => s.toUpperCase());
}

function camelTrans(str, isBig) {
  let i = isBig ? 0 : 1;
  str = str.split('-');
  for (; i < str.length; i += 1) {
    str[i] = firstUpperCase(str[i]);
  }
  return str.join('');
}

module.exports = {


  /**
   * 用户输入的是用横杠连接的名字
   * 根据用户输入的name生成各类规格变量名: 横杠连接,小驼峰,大驼峰,全大写
   */
  generateNames(name) {
    return {
      // 横杠连接
      fileName: name,

      // 小驼峰
      varName: camelTrans(name),

      // 大驼峰
      className: camelTrans(name, true),

      // 全大写
      constName: name.split('-').join('').toUpperCase()
    };
  },

  getTemplateDir(type) {
    return type ? path.resolve(templateDir, type) : templateDir;
  },

  getCwd() {
    return cwd;
  },

  /**
   * 清除 fie home 目录下的 对应名字的目录,然后创建链接当前目录的软链到 fie home 目录下
   * @param name
   */
  linkToFieHome(src, dist) {
    if (fs.existsSync(dist)) {
      shell.rm('-rf', dist);
    }
    shell.ln('-s', src, dist);
  },

  isValidName(name) {
    name = name.indexOf('@ali/') === 0 ? name.replace('@ali/', '') : name;

    return name.indexOf('fie-plugin-') === 0 || name.indexOf('fie-toolkit-') === 0;
  }
};
