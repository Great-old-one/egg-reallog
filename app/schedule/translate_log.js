'use strict';

const moment = require('moment');
const fs = require('fs-extra');

module.exports = app => {
  const config = app.config.reallog || {};
  const interval = config.interval || '20s';
  const targetDir = config.dir || `${app.baseDir}/log`;
  return {
    schedule: {
      type: 'worker', // only one worker run this task
      interval: '2m', // 每2分钟将logger同步到对应的日志目录
    },
    async task() {
      const logger = app.coreLogger;
      try {
        const srcPath = app.loggers.logger.get('jsonFile').options.file;
        if (!srcPath) return;
        const targetPath = `${targetDir}/${app.name}.${moment(new Date().getTime()).format('YYYY-MM-DD')}.json.log`;
        await fs.ensureFile(targetPath);
        await fs.copy(srcPath, targetPath);
        logger.info('egg-reallog complete sync!');
      } catch (e) {
        e.message = 'egg-reallog error';
        logger.error(e);
      }
    },
  };
};
