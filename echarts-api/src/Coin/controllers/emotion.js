const Response = require('../../utils/Response');
const Request = require('../../utils/Request');

const URL = `https://graphs2.coinmarketcap.com/global/marketcap-total/`;
const URL_BTC = `https://graphs2.coinmarketcap.com/currencies/bitcoin/`;
/**
 * 验证用户
 */
exports.getEmotion = async (ctx, next) => {
  let { start, end } = ctx.request.query;

  const url = URL_BTC + start + '/' + end + '/';
  const ret = await Request.get({}, url);
  const emotion_v1 = getEmotionV1(ret)
  const emotion_v2 = getEmotionV2(ret)

  Response.success(ctx, {
    // ...ret,
    price_usd: ret.price_usd,
    emotion_v1,
    emotion_v2,
  })
};

/**
 * 简单的计算
 * @param market_cap_by_available_supply
 * @param volume_usd
 * @returns {Array}
 */
function getEmotionV1({ market_cap_by_available_supply, volume_usd }) {
  const emotionList = []
  market_cap_by_available_supply.forEach((v, i) => {
    emotionList.push([v[0], volume_usd[i][1] / v[1]])
  })
  return emotionList
}

/**
 * 添加了 线性归一化
 * @param market_cap_by_available_supply
 * @param volume_usd
 * @returns {Array}
 */
function getEmotionV2({ market_cap_by_available_supply, volume_usd }) {
  let emotionList = []
  let ratioList = []
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  market_cap_by_available_supply.forEach((v, i) => {
    const ratio = volume_usd[i][1] / v[1]
    if (ratio > max) max = ratio;
    if (ratio < min) min = ratio;
    ratioList.push([v[0], ratio])
  })
  ratioList.forEach((v, i) => {
    // Linear normalization
    const LN = (v[1] - min) / max - min;
    emotionList.push([v[0], LN])
  })
  return emotionList
}
