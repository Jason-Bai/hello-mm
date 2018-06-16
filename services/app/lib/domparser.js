const U = require('./utils');

const parseMMJPGPage = (data) => {
  const $ = U.cheerio.load(data);
  const pageText = $('.page .info').text();
  const { 0: page } = pageText.match(/(\d+)/);
  return +page;
};

// 解析页数
const parsePage = (site, data) => parseMMJPGPage(data);

// 解析每页的galleries
const parseMMJPGGalleries = (data) => {
  const $ = U.cheerio.load(data);
  const galleries = [];

  const lis = $('.pic').find('li');

  // 不要用胖箭头，此this非彼this
  lis.each(function pickGallery() {
    const $this = $(this);

    const linkA = $this.find('a').first();
    const img = linkA.find('img');
    const name = img.attr('alt');
    const cover = img.attr('src');

    const to = linkA.attr('href');

    const publishedAt = $this.find('span').eq(1).text();

    const viewCountText = $this.children().last().text();
    const { 0: viewCount } = viewCountText.match(/\d+/);

    const gallery = {
      viewCount: +viewCount,
      name,
      cover,
      publishedAt,
      to,
    };

    galleries.push(gallery);
  });

  return galleries;
};

const parseGalleries = (site, data) => parseMMJPGGalleries(data);

const parseMMJPGPhoto = (data) => {
  const $ = U.cheerio.load(data);
  const as = $('.page').find('em');
  const page = as.last().prev().text();
  const publishedAtText = $('.info').find('i').first().text();
  const { 2: month, 3: date } = publishedAtText.match(/(\d{4})年(\d{2})月(\d{2})日/);
  const name = $('.article').find('h2').text();

  const popularityCountText = $('.info').find('i').eq(3).text();
  const popularityCount = popularityCountText.match(/\d+/);

  const likeCountText = $('.info').find('i').eq(4).text();
  const likeCount = likeCountText.match(/\d+/);

  const picInfo = $('script').eq(1).html();

  const {
    1: year,
    2: mId,
    3: pages,
    4: type = 0,
  } = picInfo.match(/\[(\d+),(\d+),(\d+),(\d+)\]/);

  const photo = {
    page: +page,
    popularityCount: +popularityCount,
    likeCount: +likeCount,
    type: +type,
    name,
    year,
    month,
    date,
    mId,
    pages,
  };

  return photo;
};

// 解析页数
const parsePhotoPage = (site, data) => parseMMJPGPhoto(data);

// 解析每页的photoes
const parseMMJPGPhotos = (data) => {
  const $ = U.cheerio.load(data);
  const photos = [];

  const lis = $('.pic').find('li');

  // 不要用胖箭头，此this非彼this
  lis.each(function pickGallery() {
    const $this = $(this);

    const linkA = $this.find('a').first();
    const img = linkA.find('img');
    const name = img.attr('alt');
    const cover = img.attr('src');

    const to = linkA.attr('href');

    const publishedAt = $this.find('span').eq(1).text();

    const viewCountText = $this.children().last().text();
    const { 0: viewCount } = viewCountText.match(/\d+/);

    const photo = {
      viewCount: +viewCount,
      name,
      cover,
      publishedAt,
      to,
    };

    photos.push(photo);
  });

  return photos;
};

const parsePhotos = (site, data) => parseMMJPGPhotos(data);

module.exports = { parsePage, parseGalleries, parsePhotoPage, parsePhotos };
