const U = require('./utils');
const { getHeaders } = require('./headers');
const DOMParser = require('./domparser');

// 获取site页数
const getPage = async (site) => {
  const config = {
    headers: getHeaders(site),
  };

  const { data } = await U.axios.get(site, config);

  return DOMParser.parsePage(site, data);
};

// 获取site某页的galleries
const getGalleries = async (site, page) => {
  const url = `${site}/${page}`;

  const headers = getHeaders(site);

  headers.Referer = `${site}/${page - 1 <= 0 ? '' : page - 1}`;

  const config = {
    headers,
  };

  const { data } = await U.axios.get(url, config);

  return DOMParser.parseGalleries(site, data);
};

const getPhoto = async (site) => {
  const config = {
    headers: getHeaders(site),
  };

  const { data } = await U.axios.get(site, config);

  const photo = DOMParser.parsePhotoPage(site, data);

  if (photo.type !== 0) {
    const url = `http://www.mmjpg.com/data.php?id=${photo.mId}&page=8999`;
    config.headers.Accept = '*/*';
    config.headers.Referer = `http://www.mmjpg.com/mm/${photo.mId}`;
    const { data: pages } = await U.axios.get(url, config);
    photo.pages = pages.split(',');
  } else {
    photo.pages = U._.range(1, +photo.pages + 1);
  }

  return photo;
};


module.exports = { getPage, getGalleries, getPhoto };
