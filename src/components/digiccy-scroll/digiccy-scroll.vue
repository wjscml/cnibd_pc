<template>
<div class="main-digiccy">
  <div class="digiccy">
    <transition-group tag="div" name="news" class="digiccy-box">
      <div class="digiccy-wrapper" v-for="(column, index) in digiccy" :key="index" v-show="index===mark" @mouseenter="stop" @mouseleave="move">
        <div class="digiccy-item" v-for="(item, index) in column.column" :key="index">
          <router-link to="/digiccy" class="name">
            <img :src="item.icon">
            <span>{{item.name}}</span>
          </router-link>
          <div class="price">
            <span>{{item.priceUsd}}</span>
            <i :class="item.isUp ? 'icon-arrow_up_fill' : 'icon-arrow_down_fill'"></i>
            <span class="percent" :class="item.isUp ? 'up' : 'down'">{{item.changeUsd1h}}</span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</div>
</template>

<script>
import {postApi} from '../../api/getApi'
const ERR_OK = '0'

const scrollIndex = 2
export default {
  data () {
    return {
      mark: 0,
      timer: null,
      digiccy: []
    }
  },
  created () {
    this.getData()
    this.play()
  },
  methods: {
    getData () {
      postApi('web.getDataCoinSlide').then(res => {
        if (res.data.errorCode === ERR_OK) {
          let column1 = res.data.data.slice(0, 9)
          let column2 = res.data.data.slice(9, 18)
          this.digiccy = [
            { column: column1 },
            { column: column2 }
          ]
        }
      })
    },
    autoPlay () {
      this.mark++
      if (this.mark === scrollIndex) {
        this.mark = 0
      }
    },
    play () {
      this.timer = setInterval(this.autoPlay, 3500)
    },
    stop () {
      clearInterval(this.timer)
    },
    move () {
      this.timer = setInterval(this.autoPlay, 3500)
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/scroll.styl"
.main-digiccy
  width: 100%
  min-width: 1050px
  margin-top: -2px
  z-index: 100
  background-color: #393a4c
  .digiccy
    overflow hidden
    margin: 0 auto
    width: 1050px
    height: 82px
    .digiccy-box
      width: 100%
      .digiccy-wrapper
        display: flex
        justify-content: space-around
        width: 100%
        .digiccy-item
          padding:0 12px
          margin:12px 0 14px 0
          width: 90px
          height: 56px
          border-left: 1px solid #7f7f7f
          &:nth-child(1)
            border-left: none
          .name
            display flex
            height: 24px
            margin-top: 2px
            color: #f0f0f0
            img
              width: 24px
              height: 24px
              margin-right: 4px
            span
              flex 1
              white-space: nowrap
              overflow: hidden
              width: 58px
              text-overflow: ellipsis
          .price
            position relative
            display flex
            align-items center
            justify-content space-between
            margin-top 14px
            height 14px
            color #999
            .icon-arrow_up_fill
              color: #ff0000
            .icon-arrow_down_fill
              color: #0ea600
            .percent
              display: none
              position: absolute
              top:-2px
              width: 100%
              padding: 2px 0
              line-height: 14px
              color: #f0f0f0
              text-align: center
              &.up
                background-color: #ff0000
              &.down
                background-color: #0ea600
          &:hover
            .percent
              display: inline-block
</style>
