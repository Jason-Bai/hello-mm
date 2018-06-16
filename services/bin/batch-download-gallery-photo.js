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
const Photo = U.model('photo');

const exit = () => {
  console.log(
    'batch-update-photo finished at: %s, consume: %d ms',
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
      path: {
        $eq: '',
      },
      status: 'enabled',
      isDelete: 'no',
    };

    const photos = await Photo.findAll({ where });

    console.log('Photos length: ', photos.length);

    const downloadPhoto = async (photo) => {
      const ms = Math.ceil(Math.random() * 2000);
      try {
        await U.sleep(ms);
        await photo.download();
        process.stdout.write('.');
      } catch (error) {
        failed.push(error || error.message);
        process.stdout.write('F');
      }
    };

    await eachSeries(photos, downloadPhoto);

    callback();
  })();
};

main(exit);
