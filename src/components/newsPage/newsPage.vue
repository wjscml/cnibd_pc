<template>
  <div id="news">
    <div class="news-nav" v-if="newsNav.length">
      <div class="news-nav-btn" v-for="(item, index) in newsNav" :key="index" :class="{'news-nav-btn-s':index===type}" @click="change(index)">
        {{item.name}}
      </div>
    </div>
    <news-column :news="news" :isLoad="isLoad" :tips="tips" @loadMore="loadMore" v-show="news.length"></news-column>
    <loading v-show="!newsNav.length"></loading>
  </div>
</template>
<script>
import NewsColumn from '../newsColumn/newsColumn.vue'
import Loading from '../../components/loading/loading'
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
export default {
  components: {
    'news-column': NewsColumn,
    'loading': Loading
  },
  data () {
    return {
      newsNav: [],
      news: [],
      type: 0,
      page: 0,
      tips: '',
      isLoad: null
    }
  },
  created () {
    this.getNewsNav()
    this.getNewsList()
  },
  watch: {
    type (i) {
      this.getNewsList()
    }
  },
  methods: {
    getNewsNav () {
      postApi('article.categories').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.newsNav = res.data.data
        }
      })
    },
    getNewsList () {
      postApi('article.getList', {
        page: 0,
        type: this.type
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
    change (i) {
      this.type = i
      this.page = 0
    }
  }
}
</script>
<style lang="stylus">
.news-nav
  overflow: hidden
  display flex
  justify-content space-between
  border-bottom: 1px solid #ccc
  .news-nav-btn
    padding 0 4px
    color #393a4c
    font-size 18px
    line-height 32px
    border-bottom 2px solid #fff
    cursor pointer
    &.news-nav-btn-s
      font-weight 600
      border-color: #1f8bee

</style>
