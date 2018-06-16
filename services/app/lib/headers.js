/* mmjpg */
const getMMJPGHeaders = () => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    Host: 'www.mmjpg.com',
    Referer: 'www.mmjpg.com',
  };
  return headers;
};

const getHeaders = (url) => getMMJPGHeaders(url);

module.exports = { getHeaders };
