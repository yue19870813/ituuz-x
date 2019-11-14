let gererator = require("./generator");
'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    // 生成pb文件
    'generate' () {
      Editor.log('Button clicked!');
      gererator.run();
    }
  },
};