const { WEB } = require('./local');

module.exports = {
  // 应用端口
  PORT: 3009,
  // 跨域白名单
  ALLOW_ORIGIN: [
    'http://172.20.70.37:3007',
    'http://192.168.99.110:3010',
    'http://172.20.150.63:3010',
    'http://localhost:3010',
    WEB
  ],
};
