<template>
  <div class="scrollNews">
    <div class="scrollNewsBox">
        <transition-group tag="div" class="scroll-content" name="news">
          <a class="scroll-item" v-for="(scroll, index) in scrollNews" :key="index" v-show="index===mark||index===mark+1" @mouseenter="stop" @mouseleave="move">
            <router-link :to="`/site/${scroll.id}`">{{scroll.title}}</router-link>
            <span>{{scroll.publish_time}}</span>
          </a>
        </transition-group>
    </div>
  </div>
</template>
<script>
const scrollIndex = 6
export default {
  data () {
    return {
      mark: 0,
      timer: null
    }
  },
  props: {
    scrollNews: {}
  },
  methods: {
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
  },
  created () {
    this.play()
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/scroll.styl"
.scrollNews
  width: 100%
  min-width: 1050px
  .scrollNewsBox
    position: relative
    width: 1050px
    margin:0 auto
    line-height: 36px
    height: 36px
    overflow: hidden
    .scroll-content
      position: absolute
      left: 0
      top:0
      .scroll-item
        display: block
        line-height: 36px
        height: 36px
        color: #666
        span
          margin-left: 20px
          color: #999
        a
          &:hover
            color: #1f8bee
</style>
