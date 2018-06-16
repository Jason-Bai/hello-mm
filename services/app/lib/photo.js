const U = require('../lib/utils');
const config = require('../configs');

const exists = U.util.promisify(U.fs.exists);

// 获取目录地址
const getPhotoFile = (photo) => {
  const { path } = config.photo;
  const { hash, galleryId } = photo;
  const dir = `${path}/${galleryId}`;
  U.mkdirp(dir);
  return `${dir}/${hash}.jpg`;
};

const download = async (photo) => {
  const { to, hash, galleryId } = photo;
  const photoFile = getPhotoFile(photo);

  const existed = await exists(photoFile);

  const { uri } = config.photo;
  const path = `${uri}/${galleryId}/${hash}`;

  if (existed) return path;

  const headers = {
    Referer: 'http://img.mmjpg.com/',
    'User-Agent': 'Mozilla/5.0',
  };

  const opts = {
    responseType: 'stream',
    headers,
  };

  const { data } = await U.axios.get(to, opts);

  return new Promise((resolve) => {
    data.pipe(U.fs.createWriteStream(photoFile)).on('close', () => resolve(path));
  });
};

module.exports = { download };
