const Response = require('../../utils/Response');
const Request = require('../../utils/Request');

const URL = `https://graphs2.coinmarketcap.com/global/marketcap-total/`
const URL_BTC = `https://graphs2.coinmarketcap.com/currencies/bitcoin/`
/**
 * 验证用户
 */
exports.getEmotion = async (ctx, next) => {
  let { start, end } = ctx.request.query;

  const url = URL_BTC + start + '/' + end + '/';
  const ret = await Request.get({}, url);

  Response.success(ctx, ret)
};
