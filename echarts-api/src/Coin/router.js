const router = require('koa-router')();
const Coin = require('./controllers/emotion');
router.prefix('/');

/**
 * test路由
 */
router.get('/emotion', Coin.getEmotion);


module.exports = router;
