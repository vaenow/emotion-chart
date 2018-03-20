var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
option = null;

function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value)
    ]
  }
}

var data = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
// for (var i = 0; i < 1000; i++) {
//   data.push(randomData());
// }

console.log(data)

function formateDate(date) {
  // return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
  return moment(date).format('YYYY-MM-DD HH:mm:ss')

}

var colors = ['#5793f3', '#d14a61', '#675bba'];
option = {
  color: colors,

  title: {
    text: 'BTC市场情绪指数 （每分钟刷新）'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (sd, date, c) {
      // console.log(sd,date,c)
      // sd.splice(1, 0, {});
      return [
        `时间：${formateDate(new Date(sd[0].value[0]))}`,
        `${sd[0].marker} ${sd[0].seriesName}：${(sd[0].value[1] * 100).toFixed(2)}%`,
        // `${sd[1].marker} ${sd[1].seriesName}：${(sd[1].value[1] * 100).toFixed(2)}%`,
        // `${sd[2].marker} ${sd[2].seriesName}：$${sd[2].value[1]}`,
        // `${sd[3].marker} ${sd[3].seriesName}：$${sd[3].value[1]}`,
        `${sd[1].marker} ${sd[1].seriesName}：$${sd[1].value[1]}`
      ].join('<br/>')
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  // yAxis: {
  //   type: 'value',
  //   boundaryGap: [0, '100%'],
  //   splitLine: {
  //     show: false
  //   }
  // },
  yAxis: [{
    type: 'value',
    name: '价格指数',
    boundaryGap: [0, '100%'],
    axisLine: {
      lineStyle: {
        // color: colors[0]
      }
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: '${value}'
    }
  }, {
    type: 'value',
    name: '情绪指数',
    max: 0.2,
    axisLine: {
      lineStyle: {
        // color: colors[1]
      }
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: function (a) {
        return a * 100 + ' %'
      }
    }
  }],
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 70,
      end: 100,
    }
  ],
  series: []
};


fetchData()

function fetchData() {
  const end = Date.now()
  const start = moment(end).subtract('month', 2).toDate().getTime()
  $.getJSON(`https://api.hox.com/emotion?start=${start}&end=${end}/`)
    .then(({ data }) => {
      console.log(data)

      const cap = data['market_cap_by_available_supply']
      const vol = data['volume_usd']
      const price = data['price_usd']
      let ratio = [
        [], // 时间
        [], // 占比
        [], // vol
        []  // cap
      ]

      let retRatio = [];
      let retStack = [];
      let retCap = [];
      let retVol = [];
      let retPrice = [];

      cap.forEach((c, i) => {
        const d = new Date(c[0])
        retRatio.push({ name: d.toString(), value: [c[0], vol[i][1] / c[1]] })
        retCap.push({ name: d.toString(), value: [c[0], cap[i][1]] })
        retVol.push({ name: d.toString(), value: [c[0], vol[i][1]] })
        retPrice.push({ name: d.toString(), value: [c[0], price[i][1]] })
      });

      // // 根据情绪指数，算出情绪占比
      // const maxRatioValue = _.maxBy(retRatio, (o) => o.value[1]).value[1];
      // console.log('maxRatioValue', maxRatioValue);
      // cap.forEach((c, i) => {
      //   const d = new Date(c[0])
      //   // console.log('retRatio[i].value / maxRatioValue', retRatio[i].value[1], maxRatioValue, retRatio[i].value[1] / maxRatioValue)
      //   retStack.push({ name: d.toString(), value: [c[0], retRatio[i].value[1] / maxRatioValue * Math.pow(10, 12)] })
      // });


      myChart.setOption({
        series: [{
          // yAxisIndex: 1,
          // lineStyle: {
          //   normal: {
          //     width: 1
          //   }
          // },
          type: 'line',
          name: '情绪指数',
          showSymbol: false,
          yAxisIndex: 1,
          hoverAnimation: false,
          data: retRatio
        }, {
          //   type: 'line',
          //   name: '情绪占比',
          //   showSymbol: false,
          //   hoverAnimation: false,
          //   data: retStack
          // }, {
          //   type: 'line',
          //   name: '市场总量',
          //   showSymbol: false,
          //   hoverAnimation: false,
          //   data: retCap
          // }, {
          //   type: 'line',
          //   name: '交易总量',
          //   showSymbol: false,
          //   hoverAnimation: false,
          //   data: retVol
          // }, {
          type: 'line',
          name: '价格指数',
          showSymbol: false,
          hoverAnimation: false,
          yAxisIndex: 0,
          data: retPrice
        }]
      });

      setTimeout(fetchData, 1 * 60 * 1000);
    });
}


if (option && typeof option === "object") {
  myChart.setOption(option, true);
}
