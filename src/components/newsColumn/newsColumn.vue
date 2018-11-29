<template>
  <div class="news-column">
    <div class="news-col-entry" v-for="(newsdetail, index) in news" :key="index">
      <a class="news-img" @click="toDetail(newsdetail)" :title="newsdetail.title"><img v-lazy="newsdetail.thumb" :src="newsdetail.thumb" :alt="newsdetail.title"></a>
      <div class="news-main" :class="classMap[articleType]">
        <div class="news-main-top">
          <a class="news-title" @click="toDetail(newsdetail)">{{newsdetail.title}}</a>
          <p class="news-summary">{{newsdetail.summary}}</p>
        </div>
        <div class="news-main-bottom">
          <router-link :to="`/author/${newsdetail.author_id}`" tag="div" class="author-info" v-if="hasName">
            <img :src="newsdetail.author_avatar" width="24" height="24">
            <span>{{newsdetail.author_name}}</span>
          </router-link>
          <i class="icon-point" v-if="hasName"></i>
          <span class="publish-time">{{newsdetail.publish_time || newsdetail.create_time}}</span>
          <div class="read-number" v-if="hasHot">
            <i class="icon-hot_fill"></i>
            <span>{{newsdetail.scan_count}}</span>
          </div>
          <div class="btn-collect" @click="deleteCollect(newsdetail.id, index)" v-if="hasCollect">
            <i class="icon-like"></i>
            <span>取消收藏</span>
          </div>
          <div class="btn-article" v-if="articleType == 0">
            <a class="draftBtn" @click="toDetail(newsdetail)">预览</a>
            <a class="draftBtn" @click="toContribute(newsdetail)">修改</a>
          </div>
        </div>
      </div>
    </div>
    <load-more @loadMore="loadMore" :tips="tips" :isLoad="isLoad" v-show="news.length > LEN"></load-more>
  </div>
</template>
<script>
import LoadMore from '../../components/load-more/load-more'

const maxLen = 15
export default {
  data () {
    return {
      maxLen: maxLen
    }
  },
  props: {
    LEN: {
      type: Number,
      default: 3
    },
    news: {},
    isLoad: {
      type: Boolean,
      default: null
    },
    tips: {
      type: String,
      default: '点击加载更多'
    },
    hasName: {
      type: Boolean,
      default: true
    },
    hasHot: {
      type: Boolean,
      default: true
    },
    hasCollect: {
      type: Boolean,
      default: false
    },
    hasEdit: {
      type: Boolean,
      default: false
    },
    hasBg: {
      type: Boolean,
      default: false
    },
    articleType: {
      type: Number,
      default: 10
    }
  },
  created () {
    this.classMap = ['', 'wait', 'pass', 'fail']
  },
  methods: {
    toDetail (item) {
      if (this.articleType < 5) {
        window.open(`/user/article/${item.id}`)
      } else {
        this.$router.push(`/site/${item.id}`)
      }
    },
    toContribute (item) {
      window.open(`/user/contribute/${item.id}`)
    },
    loadMore () {
      this.$emit('loadMore')
    },
    deleteCollect (id, index) {
      this.$emit('deleteCollect', {id, index})
    }
  },
  components: {
    'load-more': LoadMore
  }
}
</script>
<style lang="stylus">
.news-column
  .news-col-entry
    display: flex
    padding: 24px 0
    border-bottom: 1px solid #e0e0e0
    .news-img
      img
        width: 210px
        height: 152px
    .news-main
      position relative
      flex 1
      display: flex
      flex-direction column
      justify-content space-between
      margin-left: 20px
      &.pass:after
        content: ''
        position: absolute
        right: 0
        bottom: 0
        width: 100px
        height: 75px
        background-repeat: no-repeat
        background-size: 100px auto
        background-image: url(./article_status.png)
        background-position: center top
      &.wait:after
        content: ''
        position: absolute
        right: 0
        bottom: 0
        width: 100px
        height: 75px
        background-repeat: no-repeat
        background-size: 100px auto
        background-image: url(./article_status.png)
        background-position: center bottom
      &.fail:after
        content: ''
        position: absolute
        right: 0
        bottom: 0
        width: 100px
        height: 75px
        background-repeat: no-repeat
        background-size: 100px auto
        background-image: url(./article_status.png)
        background-position: center
      .news-main-top
        overflow: hidden
        display: -webkit-box
        -webkit-line-clamp:2
        -webkit-box-orient: vertical
        .news-title
          display inline-block
          margin-bottom: 14px
          line-height: 26px
          font-size: 20px
          color: #393a4c
          font-weight: 600
          cursor pointer
          &:hover
            color: #1f8bee
        .news-summary
          color #666
      .news-main-bottom
        display flex
        align-items center
        font-size 14px
        color #a8a8a8
        .author-info
          display flex
          align-items center
          img
            width 23px
            height 23px
            border-radius 50%
          span
            margin-left: 6px
            color: #999
            cursor pointer
            &:hover
              color: #1f8bee
        .icon-point
          margin 0 6px
          font-size 10px
        .publish-time
          flex 1
        .read-number
          display flex
          align-items center
          .icon-hot_fill
            margin-right 4px
            font-size 16px
            color #f03752
        .btn-collect
          display flex
          align-items center
          cursor pointer
          &:hover
            color #f00
          .icon-like
            margin-right 4px
            font-size 16px
        .btn-article
          display flex
          align-items center
          .draftBtn
            display: inline-block
            margin-left: 14px
            width 48px
            text-align: center
            color: #f8f8f8
            background-color: #1f8bee
            border-radius: 2px
            cursor pointer
</style>
