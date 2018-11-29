<template>
  <div class="imgList-wrapper">
    <div class="imgList-column" v-for="(listNewsItem, index) in listNews" :key="index">
        <div class="imgList-column-img" >
            <router-link :to="`/site/${listNewsItem.id}`" :title="listNewsItem.title"><img v-lazy="listNewsItem.thumb" :alt="listNewsItem.title"></router-link>
            <div class="tag"></div>
        </div>
        <router-link :to="`/site/${listNewsItem.id}`" class="imgList-column-text">{{listNewsItem.title}}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    listNews: {}
  }
}
</script>
<style lang="stylus">
.imgList-wrapper
  overflow: hidden
  width 100%
  padding-top: 24px
  clear both
  display flex
  justify-content space-between
  .imgList-column
    width: 174px
    .imgList-column-img
      position: relative
      img
        width: 174px
        height: 116px
      .tag
        position:absolute
        left: 0
        bottom: 0
        padding:0 8px
        line-height: 20px
        height: 20px
        font-size: 14px
        color: #fff
        text-align: center
        background-color:#393a4c
    .imgList-column-text
      overflow hidden
      display block
      height 54px
      font-size: 14px
      line-height: 18px
      color: #1f8bee
      margin-top: 12px
      &:hover
        text-decoration: underline
  .noRtMargin
    margin-right: 0
</style>
