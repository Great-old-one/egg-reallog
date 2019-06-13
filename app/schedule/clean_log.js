'use strict';

const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

// clean all xxx.log.YYYY-MM-DD beofre expried date.
module.exports = app => ({
  schedule: {
    type: 'worker', // only one worker run this task
    cron: '0 59 23 * *', // run every day at 23:59
  },

  async task() {
    const logger = app.coreLogger;
    try {
      const config = app.config.reallog || {};
      const targetPath = config.dir || `${app.baseDir}/log`;
      const maxDays = config.maxDays || 7;
      // 清除目标文件夹下过期的日志
      await removeTargetLog(targetPath, maxDays);
      logger.info('[egg-logrotator] clean all log before %s days');
      // 同时清除源文件的类容
      const srcPath = app.loggers.logger.get('jsonFile').options.file;
      if (!srcPath) return;
      await fs.writeFile(srcPath, '');
    } catch (e) {
      logger.error(e);
    }
  },
});

async function removeTargetLog(logdir, maxDays) {
  if (fs.pathExists(logdir)) {
    const files = await fs.readdir(logdir);
    const expriedDate = moment()
      .subtract(maxDays, 'days')
      .startOf('date');
    const names = files.filter(file => {
      const name = file.split('.')[1];
      if (!/^\d{4}-\d{2}-\d{2}/.test(name)) {
        return false;
      }
      const date = moment(name, 'YYYY-MM-DD').startOf('date');
      if (!date.isValid()) {
        return false;
      }
      return date.isBefore(expriedDate);
    });
    if (names.length === 0) {
      return;
    }

    await Promise.all(
      names.map(name => {
        const logfile = path.join(logdir, name);
        return fs.unlink(logfile).catch(err => {
          err.message = `[egg-logrotator] remove logfile ${logfile} error, ${err.message}`;
          console.log(err);
        });
      })
    );
  }
}
