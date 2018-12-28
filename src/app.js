const http = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/defaultConfig');
const router = require('./helper/router');
const openUrl = require('./helper/openUrl');      //自动打开浏览器

class Server {

  constructor(conf) {
    this.configs = Object.assign({}, config, conf);
  }

  start() {
    const server = http.createServer((req, res) => {
      const url = req.url;
      const filePath = path.join(this.configs.root, url);
      router(req, res, filePath, this.configs);
    });

    server.listen(this.configs.port, this.configs.hostname, () => {
      const addr = `http://${this.configs.hostname}:${this.configs.port}`;
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr);
    });
  }
}

module.exports = Server;