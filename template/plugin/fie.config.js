/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   笑斌 <joshuasui@163.com>
 */
module.exports = {
  toolkit: 'fie-toolkit-dev',
  toolkitConfig: {
  },
  tasks: {
    link: [
      {
        // 调用套件中的发布命令
        command: '__toolkitCommand__'
      }
    ],
    publish: [
      {
        command: '__toolkitCommand__'
      }
    ],
    unpublish: [
      {
        command: '__toolkitCommand__'
      }
    ],
    doc: [
      {
        command: '__toolkitCommand__'
      }
    ]
  }
};
