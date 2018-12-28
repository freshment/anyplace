

const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mime = require('./mime');          //引入 对应 contenttype 函数
const compress = require('./compress');  //引入压缩处理函数
const range = require('./range');        //引入range处理函数
const isFresh = require('./cache');      //引入缓存验证处理函数

const Handlebars = require('handlebars');                     //引入 模板引擎
const tplPath = path.join(__dirname, '../template/dir.tpl');  //tpl模板文件的绝对路径
const source = fs.readFileSync(tplPath, 'utf-8');             //同步读取tpl文件，读取一次即可，node会缓存
const template = Handlebars.compile(source);                  //编译模板文件


module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if(stats.isFile()) {
      const contentType = mime(filePath);
      res.setHeader('Content-Type', contentType);

      // 缓存验证
      if(isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      //range处理
      let rs;
      const { code, start, end } = range(stats.size, req, res);
      if(code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      }else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end })
      }

      // 压缩处理
      if(filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }

      rs.pipe(res);
    }else if(stats.isDirectory()) {
      const files = await readdir(filePath);
      const dir = path.relative(config.root, filePath);

      const data = { //定义模板数据
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',     //如果是根路径， path.relative()会返回 空字符串''
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        })
      };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(template(data));
    }
  } catch(ex) {
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
  }
};
