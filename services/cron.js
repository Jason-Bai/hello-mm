#!/usr/bin/env node

const childProcess = require('child_process');
const util = require('util');
const schedule = require('node-schedule');

const exec = util.promisify(childProcess.exec);

/* eslint no-unused-vars: 0 */
const tencentOnline = schedule.scheduleJob('4 */1 * * * *', async () => {
  const cmdFile = './bin/tencent_im_online.js';
  const { error, stdout } = await exec(cmdFile);
  console.log(`Error: ${error}`);
  console.log(`Stdout: ${stdout}`);
});
