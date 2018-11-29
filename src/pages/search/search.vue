<template>
  <div class="main">
    <div class="search-content">
        <input v-model="query" type="text" name="search" placeholder="请输入搜索内容" @keyup.enter="getSearch">
        <i @click="clear" v-show="query" class="icon-dismiss"></i>
        <div class="search-btn" @click="getSearch">站内搜索</div>
    </div>
    <div class="search-detail">
        <div class="search-detail-left">
            <div class="search-result" v-show="!showRecommend">
                <div class="block-title"><span>搜索结果</span></div>
                <news-column :news="news" :isLoad="isLoad" :tips="tips" @loadMore="loadMore" v-show="news.length"></news-column>
                <div class="news-column" v-show="hasNone">
                    <div class="search-none">
                        <p>很抱歉，没有找到 “<span>{{query}}</span>” 相关结果</p>
                        <p class="tips">请修改或者尝试其他搜索词</p>
                    </div>
                </div>
            </div>
            <div class="news-recommend" v-show="showRecommend">
              <div class="block-title"><span>推荐阅读</span></div>
              <news-column :news="recommendNews"></news-column>
            </div>
        </div>
        <div class="news-detail-right">
          <div class="news-ranking" v-if="rankingNews.length">
            <div class="block-title"><span>新闻排行</span></div>
            <news-ranking :rankingNews="rankingNews" :num=10></news-ranking>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import NewsColumn from '../../components/newsColumn/newsColumn.vue'
import NewsRecommend from '../../components/news-recommend/news-recommend.vue'
import NewsRanking from '../../components/news-ranking/news-ranking.vue'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      recommendNews: [],
      rankingNews: [],
      news: [],
      page: 0,
      type: 0,
      isLoad: false,
      tips: '点击加载更多',
      hasNone: null,
      showRecommend: null,
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchWord'
    ])
  },
  created () {
    this.getRecommend()
    this.firstGetSearch()
  },
  methods: {
    firstGetSearch () {
      this.query = this.searchWord
      this.getSearch()
    },
    getSearch () {
      this.showRecommend = false
      let params = {
        keywords: this.query,
        page: 0
      }
      postApi('article.getSearchList', params).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.news = res.data.data
        } else if (res.data.errorCode === '216') {
          this.news = []
          this.hasNone = true
        } else if (res.data.errorCode === '201') {
          this.showRecommend = true
        }
      }).catch(error => {
        if (!error.res) {
          this.news = []
        }
      })
    },
    loadMore () {
      this.tips = '正在加载...'
      this.isLoad = true
      this.page++
      let moreParams = {
        keywords: this.query,
        page: this.page
      }
      postApi('article.getSearchList', moreParams).then(res => {
        this.isLoad = false
        if (res.data.errorCode === ERR_OK) {
          this.news = this.news.concat(res.data.data)
          this.tips = '点击加载更多'
        } else {
          this.tips = '没有更多数据了~'
        }
      }).catch(error => {
        if (!error.res) {
          this.tips = '网络不给力，请稍后重试'
        }
      })
    },
    getRecommend () {
      this.rankingNews = []
      postApi('web.getTop10').then(response => {
        if (response.data.errorCode === ERR_OK) {
          this.rankingNews = response.data.data
        }
      })
      this.recommendNews = []
      postApi('web.getSpecialRecommend', {
        count: 7
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.recommendNews = res.data.data.specialArray
        }
      })
    },
    clear () {
      this.query = ''
    }
  },
  watch: {
    query () {
      this.hasNone = false
    },
    '$route' (to, from) {
      this.firstGetSearch()
    }
  },
  components: {
    'news-column': NewsColumn,
    'news-recommend': NewsRecommend,
    'news-ranking': NewsRanking
  }
}
</script>

<style lang="stylus" scoped>
.search-content
  overflow hidden
  position relative
  display flex
  align-items center
  margin: 50px auto
  width: 857px
  font-size 0
  input
    flex 1
    height 44px
    font-size: 16px
    padding 0 20px
    border-radius: 4px 0 0 4px
    border 1px solid #ccc
    border-right none
    outline: none
    color: #393a4c
    &:focus
      border-color: #393a4c
  .icon-dismiss
    position absolute
    top 13px
    right 150px
    font-size 20px
    cursor pointer
    color #ccc
  .search-btn
    width: 130px
    height 46px
    line-height 46px
    background-color: #393a4c
    text-align: center
    border-radius: 0 4px 4px 0
    font-size: 16px
    cursor pointer
    color: #fff
.search-detail
  width: 1050px
  margin: 0 auto
  overflow: hidden
  .search-detail-left
    float: left
    width: 732px
    position: relative
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
    .search-none
      margin-top:70px
      line-height: 36px
      text-align: center
      p
        font-size: 18px
        color: #666
        &.tips
          font-size:16px
          color: #a8a8a8
        span
          color: #1f8bee
  .news-detail-right
    float: right
    width: 226px
    .news-ranking,.news-recommend
      margin-bottom 40px
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
