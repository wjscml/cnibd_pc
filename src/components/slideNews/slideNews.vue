<template>
<slider class="t-slide">
  <div class="slide-item" v-for="(slide, index) in slideNews" :key="index">
    <router-link :to="`/site/${slide.id}`" class="slide-img" :title="slide.title"><img v-lazy="slide.thumb" :alt="slide.title"></router-link>
    <p class="slide-title">
      <router-link :to="`/site/${slide.id}`" class="text">{{slide.title}}</router-link>
    </p>
  </div>
</slider>
</template>
<script>
import Slider from '../../base/slider/slider'

export default {
  props: {
    slideNews: {}
  },
  components: {
    'slider': Slider
  }
}
</script>
<style lang="stylus">
.t-slide
  position relative
  float: right
  overflow hidden
  width 440px
  height 250px
  margin-top: 25px
  .slide-item
    float left
    position relative
    .slide-img
      img
        width: 440px
        height: 250px
    .slide-title
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      height 40px
      background-color: rgba(0,0,0,0.7)
      .text
        display inline-block
        width 360px
        line-height: 40px
        font-size: 16px
        text-indent: 16px
        color: #fff
        white-space nowrap
        text-overflow: ellipsis
        -o-text-overflow:ellipsis
        overflow:hidden
  .dots
    position absolute
    right 16px
    bottom 16px
    font-size: 0
    .dot
      display: inline-block
      margin: 0 3px
      width: 8px
      height: 8px
      border-radius: 50%
      background: #fff
      &.active
        background: #1f8bee
</style>
