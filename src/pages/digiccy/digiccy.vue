<template>
<div class="main">
    <div class="mainBox">
        <div class="markets-wrapper">
            <div class="item item-title">
              <div class="left">
                <span class="name">名称</span>
                <span class="price">价格</span>
              </div>
              <div class="middle">
                <span class="value">市值</span>
                <span class="business">交易量</span>
                <span class="change">流通供给量</span>
              </div>
              <div class="right">
                <span class="hour">1小时</span>
                <span class="day">24小时</span>
                <span class="week">7天</span>
              </div>
            </div>
            <div class="item" v-for="(item, index) in digiccyList" :key="index">
              <div class="left">
                <span class="name"><img class="image" :src="item.coin"><a>{{item.name}}</a></span>
                <span class="price">{{item.priceUsd}}</span>
              </div>
              <div class="middle">
                <span class="value">{{item.marketCapUsd}}</span>
                <span class="business">{{item.volumeUsd}}</span>
                <span class="change">{{item.marketCapBtc}}</span>
              </div>
              <div class="right">
                <span class="hour" :class="item.hup1">{{item.changeUsd1h}}</span>
                <span class="day" :class="item.hup24">{{item.changUsd24h}}</span>
                <span class="week" :class="item.dup7">{{item.changUsd7d}}</span>
              </div>
            </div>

            <load-more @loadMore="loadMore" :tips="tips" :isLoad="isLoad" v-show="digiccyList.length"></load-more>
        </div>
    </div>
</div>
</template>

<script>
import LoadMore from '../../components/load-more/load-more'
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
export default {
  data () {
    return {
      digiccyList: [],
      page: 0,
      tips: '',
      isLoad: null
    }
  },
  created () {
    this.getDigiccyList()
  },
  methods: {
    getDigiccyList () {
      postApi('web.getCoinList', {
        page: this.page
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.digiccyList = res.data.data
          this.tips = '点击加载更多'
        } else {
          this.tips = '暂无数据'
        }
      }).catch(error => {
        if (!error.res) {
          this.tips = '网络不给力，请稍后重试'
        }
      })
    },
    loadMore () {
      this.tips = '加载中...'
      this.isLoad = true
      this.page++
      postApi('web.getCoinList', {
        page: this.page
      }).then((res) => {
        this.isLoad = false
        if (res.data.errorCode === ERR_OK) {
          this.digiccyList = this.digiccyList.concat(res.data.data)
          this.tips = '点击加载更多'
        } else {
          this.tips = '没有更多数据了~'
        }
      }).catch(error => {
        if (!error.res) {
          this.isLoad = false
          this.tips = '网络不给力，请稍后重试'
        }
      })
    }
  },
  components: {
    'load-more': LoadMore
  }
}
</script>

<style lang="stylus">
.main
  width: 100%
  min-width: 1050px
  .mainBox
    width: 1050px
    margin: 0 auto
    .markets-wrapper
      margin-top: 36px
      .item
        display flex
        justify-content space-between
        align-items center
        height: 52px
        border-bottom: 1px solid #e0e0e0
        color: #393a4c

        &.item-title
          color: #999
          font-weight: 600
          font-size: 15px
        .left
          width 210px
          display flex
          justify-content space-between
          align-items center
          .name
            display flex
            align-items center
            .image
              width: 16px
              height: 16px
              margin-right: 6px
            a
              color: #1f8bee
        .middle
          width 450px
          display flex
          justify-content space-between
        .right
          width 240px
          display flex
          justify-content space-between
          .down
            color: #0ea600
          .up
            color: #ff0000

</style>
