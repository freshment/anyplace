module.exports = {
  hostname: '127.0.0.1',
  root: process.cwd(),
  port: 9527,
  compress: /\.[html|js|css|md]/,
  cache: {
    maxAge: 600,   //单位是 s，  600s 是十分钟
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
