<template>
  <div class="chartsBox">
    <div class="index-wrapper">
      <div class="index-column">
        <div class="name" :class="{'name-s':chart===0}" @click="changeSz">
          <a>{{szData.name}}</a>
          <span class="time">{{szData.time | dateFilter}}</span>
        </div>
        <div class="number" :class="[szData.updown>0 ? 'red' : 'green']">{{szData.price}}</div>
        <div class="change" :class="[szData.updown>0 ? 'red' : 'green']"><span class="chg">{{szData.updown | plusNumber}}</span><span class="chgPer">{{szData.percent*100 | numFilter | plusNumber}}%</span><span>&nbsp;</span></div>
      </div>
      <div class="index-line"></div>
      <div class="index-column">
        <div class="name" :class="{'name-s':chart===1}" @click="changeSp500">
            <a>{{sp500Data.name}}</a>
            <span class="time">{{sp500Data.time | dateFilter}}</span>
        </div>
        <div class="change" :class="[sp500Data.updown>0 ? 'red' : 'green']"><span class="price">{{sp500Data.price | numFilter}}</span><span class="chg">{{sp500Data.updown | plusNumber}}</span><span class="chgPer">{{sp500Data.percent*100 | numFilter | plusNumber}}%</span></div>
      </div>
      <div class="index-column">
        <div class="name" :class="{'name-s':chart===2}" @click="changeHs">
            <a>{{hsData.name}}</a>
            <span class="time">{{hsData.time | dateFilter}}</span>
        </div>
        <div class="change" :class="[hsData.updown>0 ? 'red' : 'green']"><span class="price">{{hsData.price}}</span><span class="chg">{{hsData.updown | plusNumber}}</span><span class="chgPer">{{hsData.percent*100 | numFilter | plusNumber}}%</span></div>
      </div>
    </div>
    <div class="charts-wrapper">
      <div id="echartContainer"></div>
    </div>
  </div>
</template>
<script>
import jsonp from 'jsonp'
import {getTimeArray, padDate} from '../../common/js/date.js'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')

export default {
  data () {
    return {
      chart: 0,
      szData: [],
      sp500Data: [],
      hsData: [],
      url: 'http://img1.money.126.net/data/hs/time/today/0000001.json',
      chartsData: [],
      priceData: [],
      timeData: [],
      xtick: 119.5,
      xlabel: 241,
      formatter: '{a|9:30}{b|11:30/13:00}{c|15:00}'
    }
  },
  created () {
    this.timeData = this.timeData.concat(getTimeArray(1530840600000, 1530847800000), getTimeArray(1530853200000, 1530860400000))
    this.getSzData()
    this.getSp500Data()
    this.getHsData()
  },
  watch: {
    chart (i) {
      this.drawLineChart()
    }
  },
  mounted () {
    this.drawLineChart()
  },
  methods: {
    getSzData () {
      jsonp('http://api.money.126.net/data/feed/0000001', null, (err, data) => {
        if (!err) {
          for (var o in data) {
            this.szData = data[o]
            break
          }
          console.log(this.szData)
        } else {
          console.error(err.message)
        }
      })
    },
    getSp500Data () {
      jsonp('http://api.money.126.net/data/feed/US_SP500', null, (err, data) => {
        if (!err) {
          this.sp500Data = data.US_SP500
        } else {
          console.error(err.message)
        }
      })
    },
    getHsData () {
      jsonp('http://api.money.126.net/data/feed/hkHSI', null, (err, data) => {
        if (!err) {
          this.hsData = data.hkHSI
        } else {
          console.error(err.message)
        }
      })
    },
    drawLineChart () {
      let priceData = []
      let myChart = echarts.init(document.getElementById('echartContainer'))
      myChart.setOption({
        title: {
          show: false
        },
        grid: {
          left: 3,
          right: 4,
          top: 5,
          bottom: 26
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          data: this.timeData,
          boundaryGap: false,
          axisTick: {
            interval: this.xtick
          },
          axisLabel: {
            interval: this.xlabel,
            margin: 15,
            color: '#999',
            formatter: [this.formatter].join(),
            rich: {
              a: {
                padding: [0, 0, 0, 224]
              },
              b: {
                padding: [0, 0, 0, 56],
                width: 68
              },
              c: {
                padding: [0, 0, 0, 50]
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisPointer: {
            type: 'shadow',
            snap: true,
            label: {
              show: true
            }
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitNumber: 2,
          axisLabel: {
            inside: true,
            margin: 4,
            color: '#999'
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisTick: {
            inside: true,
            length: 3
          },
          splitLine: {
            lineStyle: {
              color: ['#e0e0e0']
            }
          }
        },
        series: {
          type: 'line',
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(199, 237, 250,0.5)'
              }, {
                offset: 1,
                color: 'rgba(199, 237, 250,0.2)'
              }], false)
            }
          },
          itemStyle: {
            normal: {
              color: '#1f8bee'
            }
          }
        }
      })
      jsonp(this.url, null, (err, data) => {
        if (!err) {
          this.chartsData = data
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].splice(0, 1)
            priceData.push(data.data[i].shift())
          }
          this.priceData = priceData
          myChart.setOption({
            series: {
              data: this.priceData
            }
          })
        } else {
          console.error(err.message)
        }
      })
    },
    changeSz () {
      this.chart = 0
      let timeData = []
      timeData = timeData.concat(getTimeArray(1530840600000, 1530847800000), getTimeArray(1530853200000, 1530860400000))
      this.url = 'http://img1.money.126.net/data/hs/time/today/0000001.json'
      this.timeData = timeData
      this.xtick = 119.5
      this.xlabel = 241
      this.formatter = '{a|9:30}{b|11:30/13:00}{c|15:00}'
    },
    changeSp500 () {
      this.chart = 1
      let timeData = []
      timeData = timeData.concat(getTimeArray(1530840600000, 1530864000000))
      this.url = 'http://img1.money.126.net/data/us/time/today/SP500.json'
      this.timeData = timeData
      this.xtick = 194
      this.xlabel = 390
      this.formatter = '{a|9:30}{b|12:30}{c|16:00}'
    },
    changeHs () {
      this.chart = 2
      let timeData = []
      timeData = timeData.concat(getTimeArray(1530840600000, 1530849600000), getTimeArray(1530853200000, 1530864000000))
      this.url = 'http://img1.money.126.net/data/hk/time/today/HSI.json'
      this.timeData = timeData
      this.xtick = 164.5
      this.xlabel = 331
      this.formatter = '{a|9:30}{b|12:00/13:00}{c|16:00}'
    }
  },
  filters: {
    numFilter (value) {
      let realVal = Number(value).toFixed(2)
      return Number(realVal)
    },
    dateFilter (val) {
      val = val < 10 ? '0' + val : val
      var value = new Date(val)
      var year = value.getFullYear()
      var month = padDate(value.getMonth() + 1)
      var day = padDate(value.getDate())
      var hour = padDate(value.getHours())
      var minutes = padDate(value.getMinutes())
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
    },
    plusNumber (val) {
      val = val > 0 ? '+' + val : val
      return val
    }
  }
}
</script>
<style lang="stylus">
.index-wrapper
  height: 257px
  margin-top:20px
  .index-column
    margin-bottom:14px
    color: #393a4c
    .number
      line-height: 50px
      font-size: 30px
    .name
      display: flex
      justify-content: space-between
      line-height 28px
      font-size:16px
      cursor: pointer
      .time
        color: #999
        font-size: 13px
    .name-s
      a
        font-weight: 600
    .change
      display: flex
      justify-content: space-between
    .red
      color: red
    .green
      color: #0ea600
  .index-line
    margin-bottom: 14px
    width: 100%
    height: 1px
    background-color: #e0e0e0
.charts-wrapper
  margin-top:22px
  #echartContainer
    width: 230px
    height: 182px
</style>
