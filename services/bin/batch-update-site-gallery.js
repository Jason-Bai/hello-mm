#!/usr/bin/env node

const U = require('../app/lib/utils');
const config = require('../app/configs');

const startAt = Date.now();

const redis = config.redis || {};
U.cached.init(redis.port, redis.host, redis.opts);
U.model = U.openRestWithMysql(U.rest, `${__dirname}/../app`);

const failed = [];
const eachSeries = U.util.promisify(U.async.eachSeries);

/* eslint prefer-destructuring: 0 */
const Site = U.model('site');

const exit = () => {
  console.log(
    'batch-update-site finished at: %s, consume: %d ms',
    new Date(),
    Date.now() - startAt);
  if (failed.length) {
    console.error(failed.length);
    process.exit(1);
    return;
  }
  setTimeout(() => {
    process.exit(0);
  }, 10);
};

const main = (callback) => {
  (async () => {
    const where = {
      status: 'enabled',
      isDelete: 'no',
    };

    const sites = await Site.findAll({ where });

    const updateSite = async (site) => {
      try {
        await site.updateSite();
      } catch (error) {
        console.error(error);
        failed.push(error || error.message);
      }
    };

    await eachSeries(sites, updateSite);

    callback();
  })();
};

main(exit);
