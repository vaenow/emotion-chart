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

// console.log(data)

function formatDate(date) {
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
      return [
        `时间：${formatDate(new Date(sd[0].value[0]))}`,
        `${sd[1].marker} ${sd[1].seriesName}：${(sd[1].value[1] * 100).toFixed(2)}%`,
        // `${sd[0].marker} ${sd[0].seriesName}：$${sd[0].value[1]}`
      ].join('<br/>')
    },
    axisPointer: {
      type: 'cross',
      animation: false
    }
  },
  toolbox:{
    feature :{
      dataView: {
        show:true,
        optionToContent: function(opt) {
          var series = opt.series;
          var table = '<table style="text-align:center"><tbody><tr>'
            + '<td>时间</td>'
            + '<td>' + series[0].name + '</td>'
            + '<td>' + series[1].name + '</td>'
            + '</tr>';
          for (var i = series[0].data.length - 1; i >= 0; i--) {
            table += '<tr>'
              + '<td>' + formatDate(series[0].data[i].value[0]) + '</td>'
              + '<td>' + series[0].data[i].value[1].toFixed(5) + '</td>'
              + '<td>' + series[1].data[i].value[1].toFixed(1) + '</td>'
              + '</tr>';
          }
          table += '</tbody></table>';
          return table;
        }
      }
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
    max: 2,
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
      // start: 70,
      start: 0,
      end: 100,
    }
  ],
  series: []
};


fetchData()

function fetchData() {
  const end = Date.now()
  const start = moment(end).subtract('month', 2).toDate().getTime()
  // $.getJSON(`https://api.hox.com/emotion?start=${start}&end=${end}/`)
  $.getJSON(`http://localhost:3009/emotion?start=${start}&end=${end}/`)
    .then(({ data }) => {
      // console.log(data)
      window.temp1 = data
      const { emotion_v1, emotion_v2, price_usd } = data;

      myChart.setOption({
        series: [/*{
          type: 'line',
          name: '情绪指数v1',
          showSymbol: false,
          yAxisIndex: 1,
          hoverAnimation: false,
          data: emotion_v1.map(mapToEchart)
        }, */{
          type: 'line',
          name: '价格指数',
          showSymbol: false,
          hoverAnimation: false,
          yAxisIndex: 0,
          data: price_usd.map(mapToEchart)
        }, {
          type: 'line',
          name: '情绪指数',
          showSymbol: false,
          yAxisIndex: 1,
          hoverAnimation: false,
          data: emotion_v2.map(mapToEchart)
        }, {
          type: 'line',
          name: '回测指数',
          showSymbol: false,
          yAxisIndex: 0,
          hoverAnimation: false,
          data: []
        }]
      });

      setTimeout(fetchData, 5 * 60 * 1000);
    });
}

function mapToEchart(v, k) {
  return {
    name: new Date(v[0]).toString(),
    value: [v[0], v[1]]
  }
}

if (option && typeof option === "object") {
  myChart.setOption(option, true);
}
