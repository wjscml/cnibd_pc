<template>
<div>
  <div class="recommend-column" v-for="(item, index) in recommendNews" :key="index">
    <div class="rec-col-img">
      <router-link :to="`/site/${item.id}`" :title="item.title"><img v-lazy="item.thumb" :alt="item.title"></router-link>
    </div>
    <router-link :to="`/site/${item.id}`" tag="h1" class="title">{{item.title}}</router-link>
    <p class="info">
      <router-link :to="`/author/${item.author_id}`" class="name">{{item.author_name}}</router-link>
      <span class="time">·&nbsp;{{item.publish_time}}</span>
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
    recommendNews: {}
  }
}
</script>
<style lang="stylus">
.recommend-column
  margin-bottom: 44px
  .rec-col-img
    img
      width: 230px
      height: 150px
  .title
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden
    margin: 14px 0
    line-height: 24px
    font-size: 16px
    font-weight: 600
    color: #393a4c
    cursor pointer
    &:hover
      color: #1f8bee
  .info
    font-size: 14px
    line-height: 14px
    color: #393a4c
    .time
      color: #a8a8a8
    .name
      color: #999
      &:hover
        color: #1f8bee
</style>
