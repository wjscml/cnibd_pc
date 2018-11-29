<template>
<div class="news" v-wechat-title="`${currentNav.name}新闻 - 赛恩财经`">
  <div class="news-wrapper">
    <div class="news-wrapper-left">
      <div class="news-name"><h1>{{currentNav.name}}</h1></div>
      <news-column :news="news" :isLoad="isLoad" :tips="tips" @loadMore="loadMore" v-show="news.length"></news-column>
      <loading class="loading-wrapper" v-show="!news.length"></loading>
    </div>
    <div class="news-wrapper-right">
      <div class="news-recommend" v-if="recommendNews.length">
        <div class="block-title"><span>推荐阅读</span></div>
        <news-recommend :recommendNews="recommendNews"></news-recommend>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NewsColumn from '../../components/newsColumn/newsColumn.vue'
import NewsRecommend from '../../components/news-recommend/news-recommend.vue'
import Loading from '../../components/loading/loading'
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
export default {
  components: {
    'news-column': NewsColumn,
    'news-recommend': NewsRecommend,
    'loading': Loading
  },
  data () {
    return {
      currentNav: {},
      news: [],
      page: 0,
      tips: '',
      isLoad: null,
      recommendNews: []
    }
  },
  created () {
    this.httpGet()
  },
  methods: {
    httpGet () {
      this.getNavName()
      this.getNewsList()
      this.getRecommend()
    },
    getNavName () {
      postApi('article.categories').then(res => {
        if (res.data.errorCode === ERR_OK) {
          let currentNav = res.data.data.slice(Number(this.$route.params.id), Number(this.$route.params.id) + 1)
          for (var o in currentNav) {
            this.currentNav = currentNav[o]
            break
          }
        }
      })
    },
    getNewsList () {
      this.news = []
      postApi('article.getList', {
        page: 0,
        type: this.$route.params.id
      }).then((res) => {
        if (res.data.errorCode === ERR_OK) {
          this.news = res.data.data
          this.tips = '点击加载更多'
        } else {
          this.news = []
          this.tips = '暂无数据'
        }
      }).catch(error => {
        if (!error.res) {
          this.news = []
          this.tips = '网络不给力，请稍后重试'
        }
      })
    },
    loadMore () {
      this.tips = '加载中...'
      this.isLoad = true
      this.page++
      postApi('article.getList', {
        page: this.page,
        type: this.type
      }).then((res) => {
        this.isLoad = false
        if (res.data.errorCode === ERR_OK) {
          this.news = this.news.concat(res.data.data)
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
    },
    getRecommend () {
      this.recommendNews = []
      postApi('web.getSpecialRecommend', {
        count: 7
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.recommendNews = res.data.data.specialArray
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.httpGet()
    }
  }
}
</script>

<style lang="stylus">
.news
  width: 100%
  min-width: 1050px
  margin-top: 24px
  .news-wrapper
    overflow hidden
    width: 1050px
    margin: 0 auto
    .news-wrapper-left
      float left
      width  732px
      .news-name
        border-bottom 1px solid #cccccc
        h1
          width: 104px
          font-size: 18px
          line-height: 32px
          color: #393a4c
          font-weight: bold
          text-align: center
          border-bottom: 2px solid #1f8bee
      .loading-wrapper
        margin-top 20%
    .news-wrapper-right
      float right
      width  226px
      .block-title
        margin-bottom 18px
        border-bottom 1px solid #cccccc
        span
          display inline-block
          font-size: 18px
          line-height: 32px
          color: #393a4c
          font-weight: bold
          border-bottom: 2px solid #1f8bee

</style>
