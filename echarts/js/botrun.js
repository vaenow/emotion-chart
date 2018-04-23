function boot({ blockLen = 8, pices = 10 } = {}) {
  // let blockLen = 8 // 数据块大小
  let initTotalAsset = temp1.price_usd[0][1] // 初始化资金
  let totalDataLen = temp1.price_usd.length // 当前获得数据长度
  // let totalAssetRate = 1 // 总资产率 100%
  let preStrategy // 前一个策略
  let preOrder = {
    totalAssetRate: 1, // 总资产率 100%
    boughtPrice: 0, // 最近买入价格
    action: SELL // 最近操作动作
  }

  let profitDataList = []

  for (let i = 0; i < totalDataLen - blockLen; i++) {
    let block = getBlock(temp1, i, blockLen)
    preStrategy = test(block, pices, preStrategy)
    if (!preStrategy) {
      console.warn('no strategy: blockLen, pices', blockLen, pices)
      continue
    }
    let { actions, assetRate, top, bottom, beyongTopAction } = preStrategy

    const { emotionRate, price } = block
    const lastEmotionRate = emotionRate[emotionRate.length - 1][1]
    const lastPrice = price[price.length - 1][1]
    const timestamp = price[price.length - 1][0]
    if ( // 买入的条件
    (
      (beyongTopAction === BUY && lastEmotionRate > top)
      || (beyongTopAction === SELL && lastEmotionRate < bottom)
    )
    && preOrder.action !== BUY
    ) {
      preOrder.boughtPrice = lastPrice // 更新最近买入价格
      preOrder.action = BUY

      console.log('action BUY', formatDate(timestamp), lastPrice)

    } else if ( // 卖出的条件
    (
      (beyongTopAction === BUY && lastEmotionRate < bottom)
      || (beyongTopAction === SELL && lastEmotionRate > top)
    )
    && preOrder.action !== SELL
    ) {
      const subAssetRate = percent(preOrder.boughtPrice, lastPrice)
      preOrder.totalAssetRate *= (1 + subAssetRate)
      preOrder.action = SELL

      console.log('action SELL', formatDate(timestamp), lastPrice, subAssetRate, +preOrder.totalAssetRate.toFixed(5))
      profitDataList.push([timestamp, preOrder.totalAssetRate * initTotalAsset])
      putInChart(profitDataList)
    }
  }
  console.log(
    percent(temp1.price_usd[0][1], temp1.price_usd[temp1.price_usd.length - 1][1]),
    preOrder.totalAssetRate,
    blockLen,
    pices
  )

  return preOrder.totalAssetRate
}

function putInChart(dataList) {
  setTimeout(() => {
    myChart.setOption({
      series: [
        {}, {}, {
          data: /*[[Date.now(), 0.22]]*/dataList.map(mapToEchart)
        }
      ]
    })
  })
}

function best(block = [70, 90], pices = [4, 12]) {
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = block[0]; i < block[1]; i++) {
    for (let j = pices[0]; j < pices[1]; j++) {
      const ret = boot({ blockLen: i, pices: j })
      if (ret > max) {
        max = ret
        console.log('best', ret, i, j)
      }
    }
  }
}
