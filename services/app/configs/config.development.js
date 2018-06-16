const config = require('./base');

const { env } = process;

config.service.port = '9988';

config.db.host = env.ORT_HOST || '127.0.0.1';
config.db.port = env.ORT_PORT || '3306';
config.db.user = env.ORT_USER || 'root';
config.db.pass = env.ORT_PASS || 'rootrootroot';
config.db.name = env.ORT_NAME || 'hellomm_dev';

config.cache.host = '127.0.0.1';
config.cache.port = '6379';
config.cache.opts.namespace = 'ORB';

module.exports = config;
