<template>
<div class="author-list-wrapper">
  <transition-group tag="div" class="author-content" name="image">
    <div class="author-column" v-for="(column, index) in authorList" :key="index" v-show="index === mark" @mouseenter="stop" @mouseleave="move">
      <router-link :to="`/author/${item.id}`" tag="div" class="author-item" v-for="(item, index) in column.column" :key="index">
        <div class="image"><img :src="item.avatar"></div>
        <h1 class="name">{{item.nickname}}</h1>
        <p class="content"><span>•&nbsp;</span>{{item.title}}</p>
      </router-link>
    </div>
  </transition-group>
  <div class="author-dots">
    <span class="dot" v-for="(item, index) in authorList" :key="index" :class="{active: mark === index}" v-if="index < scrollIndex" @click="change(index)"></span>
  </div>
</div>

</template>

<script>
export default {
  data () {
    return {
      scrollIndex: 3,
      mark: 0,
      timer: null
    }
  },
  props: {
    authorList: {}
  },
  methods: {
    autoPlay () {
      this.mark++
      if (this.mark === this.scrollIndex) {
        this.mark = 0
      }
    },
    play () {
      this.timer = setInterval(this.autoPlay, 7000)
    },
    stop () {
      clearInterval(this.timer)
    },
    move () {
      this.timer = setInterval(this.autoPlay, 7000)
    },
    change (i) {
      this.mark = i
    }
  },
  created () {
    this.play()
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/scroll.styl"
@import "../../common/stylus/vip"
.author-list-wrapper
  margin-top -18px
  .author-content
    overflow hidden
    position relative
    width 230px
    height 404px
    .author-column
      position absolute
      left 0
      top 0
      width 100%
      .author-item
        position: relative
        height 134px
        margin-top: 66px
        border: 1px solid #e0e0e0
        background-color #fff
        cursor pointer
        .image
          vip(22px, url(../../common/image/vip-steps.png))
          position: absolute
          top: -35px
          left: 80px
          img
            width 70px
            height 70px
            border-radius 50%
            box-sizing border-box
            box-shadow: 0 0 4px #fffc00
        .name
          margin-top: 48px
          line-height: 18px
          font-size: 18px
          text-align: center
          color: #393a4c
        .content
          margin: 14px 14px
          line-height: 20px
          color: #999
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          overflow: hidden
          span
            color #1f8bee
  .author-dots
    margin-top 20px
    text-align center
    font-size 0
    .dot
      display: inline-block
      margin: 0 10px
      width 8px
      height 8px
      border-radius 4px
      background-color #ccc
      &.active
        width 16px
        background-color #1f8bee
</style>
