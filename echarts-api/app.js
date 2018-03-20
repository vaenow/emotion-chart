const Koa = require('koa');
const app = new Koa();
const CONFIG = require('./config/app');
const DATABASE = require('./config/database');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const cors = require('koa2-cors');
const koaStatic = require('koa-static');
const path = require('path');
import cookie from 'koa-cookie';
import Q from 'bluebird';
import routers from './src/routers';

// error handler
onerror(app);
// middlewares
app.use(logger());
// app.use(cookie());
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  multipart: true
}));
app.use(json());

// 配置静态资源
app.use(koaStatic(path.join(__dirname, './static')));

// 跨域相关设置
app.use(cors({
  origin: ctx => CONFIG.ALLOW_ORIGIN.findIndex(v => v === ctx.request.header.origin) === -1 ? false : ctx.request.header.origin,
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Access-Control-Allow-Credentials'],
}));

// 路由
routers.forEach(router => app.use(router.routes(), router.allowedMethods()));

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// 数据库
// mongoose.Promise = Q;
// const msg = `mongodb://${DATABASE.USERNAME ? `${DATABASE.USERNAME}:${DATABASE.PASSWORD}@` : ''}${DATABASE.URI}:${DATABASE.PORT}/${DATABASE.NAME}`
// console.log('msg', msg)
// mongoose.connect(msg, { useMongoClient: true });

// listen
app.listen(CONFIG.PORT);
console.log(`starting at port ${CONFIG.PORT}`);

module.exports = app;
