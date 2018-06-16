const assert = require('assert');
const childProcess = require('child_process');
const U = require('../../app/lib/utils');

const exec = U.util.promisify(childProcess.exec);

const axiosGet = U.axios.get;

module.exports = [{
  name: '查看初始时在线人数',
  uri: '/imonlines',
  verb: 'get',
  headers: {
    'X-Auth-Token': 'MOCK::1',
  },
  expects: {
    Status: 200,
    JSONLength: 1,
  },
}, () => {
  U.axios.get = (url) => {
    assert.equal(url, 'https://mma.qq.com/cgi-bin/im/online');
    return new Promise((resolve) => {
      setTimeout(() => resolve('online_resp({"c":273625519,"ec":0,"h":282877126})'), 100);
    });
  };

  return '';
}, async () => {
  const cmdPath = U.path.resolve(__dirname, '../../bin/tencent_im_online.js');
  await exec(cmdPath);
  return '';
}, {
  name: '查看变化后在线人数',
  uri: '/imonlines',
  verb: 'get',
  headers: {
    'X-Auth-Token': 'MOCK::1',
  },
  expects: {
    Status: 200,
    JSONLength: 2,
  },
}, () => {
  U.axios.get = axiosGet;
  return '';
}];
