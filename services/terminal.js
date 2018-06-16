#!/usr/bin/env node

const schedule = require('node-schedule');
const U = require('./app/lib/utils');
const config = require('./app/configs');

const { dateTimeFormat } = config;

const stack = [];

const getImOnlineList = async (page = 1, pageSize = 10) => {
  const url = `http://www.zaohuayudie.com/djyl/api/recommend/next?page=${page}&pageSize=${pageSize}&types=8,9`;
  const { data } = await U.axios.get(url);
  return data;
};

// 打印行打印
const recommend = msg => U.colors.yellow(msg);

// 正常行打印
const normal = (num, nums) => {
  const mactched = nums.includes(num);
  if (mactched) {
    return U.colors.red(num);
  }
  return U.colors.green(num);
};

// 获取打印信息
const getMsg = (result) => {
  const { use } = result;
  const main = U._.get(result, 'main.num');
  const assist = U._.get(result, 'assist.num');
  const assist2 = U._.get(result, 'assist2.num');
  const term = U._.get(result, 'term');
  const nums = U._.get(result, 'number.nums');

  let msg;

  // 正常行
  if (use === 1) {
    msg = `${term} ${nums.join()} ${normal(main, nums)} ${normal(assist, nums)} ${normal(assist2, nums)}`;
  } else {
    msg = `${term}           ${recommend(main)} ${recommend(assist)} ${recommend(assist2)}`;
  }

  return msg;
};

// 获取全部打印信息
const getYffsMsgs = (data) => {
  const results = U._.get(data, 'yffs.betList.results');
  const msgs = [];

  U._.each(results, (result) => {
    const msg = getMsg(result);
    msgs.push(msg);
  });

  return msgs;
};

// 初始显示信息
const init = async () => {
  const data = await getImOnlineList();

  const msgs = getYffsMsgs(data);

  U._.each(msgs, (msg) => {
    stack.push(msg);
  });

  return stack;
};

// 刷新显示信息
const refresh = async () => {
  const data = await getImOnlineList(1, 1);

  const [next, previous] = U._.get(data, 'yffs.betList.results');

  // 上一条
  const previousMsg = getMsg(previous);
  const nextMsg = getMsg(next);

  // 去掉最后一条
  stack.pop();

  // 重置第一条
  stack[0] = previousMsg;

  // 新增一条
  stack.unshift(nextMsg);

  return stack;
};

const main = async () => {
  const list = await init();
  console.log(`---------------------${U.moment().format(dateTimeFormat)}---------------------`);
  console.log(list.join('\n'));
};

schedule.scheduleJob('5 */1 * * * *', async () => {
  const list = await refresh();
  console.log(`---------------------${U.moment().format(dateTimeFormat)}---------------------`);
  console.log(list.join('\n'));
});

main();
