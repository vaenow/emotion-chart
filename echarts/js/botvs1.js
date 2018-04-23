/**
 * Created by luowen on 2018/4/22
 */

function daysAgo(millions, day) {
  return millions - day * 24 * 60 * 60
}

let BUY = 'BUY'
let SELL = 'SELL'
let HOLD = 'HOLD'


let strategy = {

  actions: [{}],
}
// 全局状态
let Global = {
  // actioning: HOLD,
  // asset: 1,
  strategies: []
}

function test(block, pices, preStrategy) {
  let top = Number.MIN_SAFE_INTEGER
  let bottom = Number.MAX_SAFE_INTEGER
  // Global.actioning = HOLD
  // let step = 1;
  // let pices = 10; // 预设需要多少个分片

  // 指数范围
  const rateRange = getEmotionRateRange(block.emotionRate)
  // console.log('rateRange', rateRange)
  // 步长
  let step = (rateRange[1] - rateRange[0]) / pices
  // console.log('step', step)

  // 上下范围
  top = rateRange[1]
  bottom = rateRange[0]

  // 开始迭代
  // 此次迭代，为了寻找一个block里最优的top,bottom
  let profitList = []
  while (top - bottom > 0.0001) {
    let top1 = top
    let bottom1 = bottom

    let strategiesTb, strategiesTs;
    while (top1 - bottom1 > 0.0001) {
      strategiesTb = getStrategies(block, top1, bottom1, BUY)
      strategiesTs = getStrategies(block, top1, bottom1, SELL)
      top1 -= step // top 向下移动步长
    }
    const profitTb = parseStrategiesProfit(block, strategiesTb)
    const profitTs = parseStrategiesProfit(block, strategiesTs)

    const betterProfit = (profitTb > profitTs) ? profitTb : profitTs
    // console.log('betterProfit', betterProfit, top1, bottom1)
    profitList.push({ ...betterProfit })

    bottom += step // bottom 向上移动步长
  }

  const maxProfitStrategy = _.maxBy(profitList, 'assetRate')
  // TODO
  // console.log(
  //   maxProfitStrategy.assetRate,
  //   percent(block.price[0][1], block.price[block.price.length - 1][1])
  // )

  return maxProfitStrategy
}

function percent(start, end) {
  return +((end - start) / start).toFixed(5)
}

/**
 * 取值范围
 **/
function getEmotionRateRange(range) {
  return [
    _.minBy(range, 1)[1],
    _.maxBy(range, 1)[1]
  ]
}


// 获取策略
function getStrategies(block, top, bottom, beyongTopAction = BUY) {
  const {
    emotionRate,
    price
  } = block

  let strategy = {
    beyongTopAction,
    top,
    bottom,
    actions: [],
  }
  for (let i = 0; i < emotionRate.length; i++) {
    const rate = emotionRate[i][1]
    // const actionKey = beyongTopAction === BUY ? 'tb' : 'ts';
    // const action = beyongTopAction === BUY ? BUY : SELL;

    //

    let action = HOLD
    if (rate >= top) {
      action = beyongTopAction === BUY ? BUY : SELL
    } else if (rate <= bottom) {
      action = beyongTopAction === BUY ? SELL : BUY
    }

    // TODO
    if (shouldPushOrderAction(strategy.actions, action)) {
      strategy.actions.push({
        dateFormat: formatDate(price[i][0]),
        timestamp: price[i][0],
        price: price[i][1],
        action
      })
    }

  }

  return strategy
}

// 转化策略的收益
function parseStrategiesProfit(block, strategies) {
  let assetRate = 1;
  _.reduce(strategies.actions, (a, b) => {
    const diff = percent(a.price, b.price) // (b.price - a.price) / b.price
    assetRate *= (1 + diff)
    return b
  })

  return {
    ...strategies,
    assetRate,
  }
}

function shouldPushOrderAction(actions, action) {
  if (!actions.length) return true;

  const lastAction = actions[actions.length - 1]
  if (
    action === HOLD
    || lastAction.action === HOLD
    || lastAction.action === action
  ) return false

  return true

  // const lastStrategy = Global.strategies[Global.strategies.length - 1]
  // if (lastStrategy) {
  //   const action = lastStrategy.actions[lastStrategy.actions - 1]
  //   if (action) {

  //   } else {
  //     return true
  //   }
  // } else {
  //   return true
  // }
}

// 执行仓位操作
function execOrderAction(block, beyongTopAction) {
  if (beyongTopAction === BUY) {

  }
}

function getBlock(temp, start, len) {
  // console.log('start, len', start, len)
  let block = {
    price: temp['price_usd'].slice(start, start + len),
    emotionRate: temp['emotion_v2'].slice(start, start + len),
  }
  // for(let k in temp) {
  //   if (temp[k] instanceof Array)
  //     block[k] = temp[k].slice(start, start + len)
  // }
  return block;
}

// - 选取一小段时间范围
// - 使用 tB/bS
//   - 调整 top/bottom
//     - 当ratio大于top时，B
//     - 当ratio小于bottom时，S
// - 使用 tS/bB
//   - 调整 top/bottom
//     - 当ratio大于top时，S
//     - 当ratio小于bottom时，B
// - 择其最优参数，计算当前指令：B/S/N
