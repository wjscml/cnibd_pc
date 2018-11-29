<template>
  <div class="t-news">
    <div class="t-news-item" v-for="(tNewsItem, index) in tNews" :key="index" v-if="index < maxLen" :class="{'noBtBorder':index===1}">
        <router-link :to="`/site/${tNewsItem.id}`" tag="div" class="title">{{tNewsItem.title}}</router-link>
        <p class="info">
          <router-link :to="`/author/${tNewsItem.author_id}`" class="author">{{tNewsItem.author_name}}</router-link>
          <span class="date">{{tNewsItem.publish_time}}</span>
        </p>
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
    tNews: {},
    maxLen: {
      type: Number,
      default: 2
    }
  }
}
</script>
<style lang="stylus">
.t-news
  float: left
  width: 300px
  height 255px
  margin-top 20px
  display flex
  flex-direction column
  justify-content space-between
  .t-news-item
    padding-bottom 16px
    border-bottom: 1px solid #e0e0e0
    &.noBtBorder
      padding-bottom 0
      border: none
    .title
      height 72px
      line-height: 36px
      font-size: 24px
      font-weight: 600
      color: #393a4c
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
      overflow: hidden
      cursor pointer
      &:hover
        color #1f8bee
    .info
      overflow: hidden
      line-height: 36px
      font-size: 14px
      color: #999
      .author
        float: left
        &:hover
          color #1f8bee
      .date
        float: right
</style>
