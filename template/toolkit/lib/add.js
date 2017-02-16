'use strict';

let fieInstance;
const toolUtil = require('./util');
const fs = require('fs');
const path = require('path');

module.exports = function (fie, options) {
  const clientArgs = options.clientArgs;
  const type = clientArgs.type;
  const name = clientArgs.name;

  fieInstance = fie;

  if (type === 'data' || type === 'd') {
    addData(name);
  } else {
    fieInstance.logError('需要添加的类型错误');
  }
};


/**
 * 添加mock数据
 * 在 data目录下添加一个 xxx.json文件 , 在 apimap.js里面注入一个请求信息
 */
function addData(name) {
  let allNames;
  let apiMapFile;
  let apiMapContent;

  if (!name) {
    fieInstance.logError('请输入要添加的数据名,多个单词,请使用横杠连接');
    return;
  }

  allNames = toolUtil.generateNames(name);
  if (fs.existsSync(path.resolve(toolUtil.getCwd(), 'data', `${allNames.fileName}.json`))) {
    fieInstance.logError('该数据已存在，创建失败');
    return;
  }

  // 复制文件
  fieInstance.fileCopy({
    src: path.resolve(toolUtil.getTemplateDir('data'), 'demo.json'),
    dist: path.resolve(toolUtil.getCwd(), 'data', `${allNames.fileName}.json`)
  });

  // 注入apiMap
  apiMapFile = path.resolve(toolUtil.getCwd(), 'src/util/apimap.js');
  if (fs.existsSync(apiMapFile)) {
    apiMapContent = fieInstance.fileRewrite({
      content: fs.readFileSync(apiMapFile).toString(),
      hook: '/*invoke*/',
      insertLines: [
        `  ${allNames.varName}: ['/${allNames.fileName}','get'],`
      ]
    });
    fs.writeFileSync(apiMapFile, apiMapContent);
    fieInstance.logSuccess(`${apiMapFile} 文件注入成功`);
  }
}

