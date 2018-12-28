const { cache } = require('../config/defaultConfig');

function refreshRes(stats, res) {
  const { maxAge, expires, cacheControl, lastModified, etag } = cache;

  if(expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString())
  }

  if(cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }

  if(lastModified) {
    res.setHeader('Last-modified', stats.mtime.toUTCString())
  }

  if(etag) {
    res.setHeader('ETag', `${stats.size}-asdasd`)
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {// 拿不到 lastModified 和 etag，很有可能是客户端第一次请求
    return false;
  }

  if(lastModified && lastModified !== res.getHeader('Last-Modified')) { //缓存失效了
    return false;
  }

  if(etag && etag !== res.getHeader('ETag')) { //缓存失效了
    return false;
  }

  return true; //可以继续用缓存
}
