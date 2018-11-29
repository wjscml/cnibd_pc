<template>
<div class="main">
  <div class="author-wrapper">
    <div class="author-left" v-show="news">
      <div class="artical-list">
        <div class="news-col-entry" v-for="(item, index) in news" :key="index">
          <div class="news-title">
            <router-link :to="item.url" class="title">{{item.title}}</router-link>
          </div>
          <div class="news-main">
            <div class="news-main-img"><img :src="item.thumb"></div>
            <div class="news-main-text">
              <p class="summary">{{item.summary}}</p>
              <div class="info">
                <span class="time">{{item.publish_time}}</span>
                <span class="keywords">区块链，时讯</span>
              </div>
            </div>
          </div>
        </div>
        <load-more @loadMore="loadMore" :tips="tips" :isLoad="isLoad" v-show="news.length > 3"></load-more>
        <no-result class="noresult-author" tips="暂未发表文章" v-show="isNoResult"></no-result>
      </div>
    </div>
    <div class="author-right">
      <div class="author-info">
          <div class="avatar" :class="{'vip': authorInfo.is_certificate}"><img :src="authorInfo.avatar"></div>
          <div class="name">
              <span>{{authorInfo.nickname}}</span>
          </div>
          <p class="brief">{{authorInfo.description | none}}</p>
          <div class="count">
            <i class="icon-subscription"></i>
            <span>共发表201篇</span>
          </div>
          <button @click="toggleFavorite" class="focus" :class="{'focus-s': authorInfo.is_follow}">{{followTips}}</button>
      </div>
      <div class="news-ranking" v-if="rankingNews.length">
        <div class="block-title"><span>新闻排行</span></div>
        <news-ranking :rankingNews="rankingNews" :num=10></news-ranking>
      </div>
    </div>
  </div>
  <confirm @confirm="confirmOK" :text="confirmText" ref="confirm"></confirm>
</div>
</template>

<script>
import NewsRanking from '../../components/news-ranking/news-ranking.vue'
import Confirm from '../../components/confirm/confirm'
import LoadMore from '../../components/load-more/load-more'
import NoResult from '../../base/no-result/no-result'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      news: [],
      authorInfo: [],
      confirmText: '',
      rankingNews: [],
      page: 0,
      tips: '',
      isLoad: null,
      isNoResult: false
    }
  },
  filters: {
    none: function (value) {
      if (!value) return '作者忙得飞起，忘了介绍自己'
      return value
    }
  },
  computed: {
    followTips: function () {
      if (this.authorInfo.is_follow === 1) {
        return '已关注'
      } else if (this.authorInfo.is_follow === 0) {
        return '关注'
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    this._getAuthor()
    this.getRecommend()
  },
  methods: {
    getRecommend () {
      this.rankingNews = []
      postApi('web.getTop10').then(response => {
        if (response.data || response.data.errorCode === ERR_OK) {
          this.rankingNews = response.data.data
        }
      })
    },
    _getAuthor () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        this.params = {
          authorId: this.$route.params.id,
          page: 0,
          session: this.userInfo.data.session || this.userInfo.data.data.session
        }
        this.getAuthor()
      } else {
        this.params = {
          authorId: this.$route.params.id,
          page: 0
        }
        this.getAuthor()
      }
    },
    getAuthor () {
      postApi('user.authorPublish', this.params).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.authorInfo = res.data.data.userInfo
          this.news = res.data.data.publishArticles
          this.tips = '点击加载更多'
          if (res.data.data.publishArticles.length === 0) {
            this.isNoResult = true
          }
        }
      }).catch(error => {
        if (!error.res) {
          this.tips = '网络不给力，请稍后重试'
        }
      })
    },
    loadMore () {
      this.tips = '正在加载...'
      this.isLoad = true
      this.page++
      let moreParams = {
        authorId: this.$route.params.id,
        page: this.page
      }
      postApi('user.authorPublish', moreParams).then(res => {
        console.log(res.data.data.publishArticles)
        if (res.data.errorCode === ERR_OK) {
          this.isLoad = false
          if (res.data.data.publishArticles.length === 0) {
            this.tips = '没有更多数据了~'
          } else {
            this.news = this.news.concat(res.data.data.publishArticles)
            this.tips = '点击加载更多'
          }
        }
      }).catch(error => {
        if (!error.res) {
          this.tips = '网络不给力，请稍后重试'
        }
      })
    },
    toggleFavorite () {
      if (this.authorInfo.is_follow === 0) {
        this.isFavorite()
      } else if (this.authorInfo.is_follow === 1) {
        this.confirmText = '是否不再关注此作者'
        this.showConfirm()
      }
    },
    isFavorite () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        postApi('user.follow', {
          session: this.userInfo.data.session || this.userInfo.data.data.session,
          followUserId: this.$route.params.id
        }).then(res => {
          if (res.data.data.action === 1) {
            this.authorInfo.is_follow = 1
          }
          if (res.data.data.action === 2) {
            this.authorInfo.is_follow = 0
          }
        })
      } else {
        this.confirmText = '登录后方可关注作者'
        this.showConfirm()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmOK () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        this.isFavorite()
      } else {
        this.$router.push('/login')
      }
    }
  },
  components: {
    'confirm': Confirm,
    'news-ranking': NewsRanking,
    'load-more': LoadMore,
    'no-result': NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/vip'
.main
  width: 100%
  min-width: 1050px
  margin-top: 24px
  .author-wrapper
    width 1050px
    margin 0 auto
    overflow hidden
    .author-left
      float left
      .artical-list
        width: 680px
        .news-col-entry
          padding-bottom: 24px
          border-bottom: 1px solid #e0e0e0
          .news-title
            line-height: 26px
            margin-top: 24px
            margin-bottom: 20px
            font-size 18px
            color: #333
            .title
              display: inline-block
              color: #393a4c
              font-size 20px
              font-weight: 600
              &:hover
                color #1f8bee
          .news-main
            display flex
            .news-main-img
              margin-right 20px
              img
                width: 210px
                height: 152px
            .news-main-text
              flex 1
              display flex
              flex-direction column
              font-size: 14px
              .summary
                flex 1
                color #666
              .info
                line-height 14px
                color: #999
                .time
                  margin-right: 40px
        .noresult-author
          margin-top 140px
    .author-right
      float: right
      width: 280px
      .author-info
        width: 278px
        border:1px solid #e0e0e0
        margin 24px 0 40px
        padding-bottom: 24px
        text-align: center
        .avatar
          margin: 30px auto
          width: 80px
          img
            width: 80px
            height: 80px
            border-radius: 40px
          &.vip
            vip(22px, url(../../common/image/vip-steps.png))
        .name
          margin-bottom: 10px
          line-height: 18px
          font-size: 18px
        .brief
          margin 14px 20px
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          overflow: hidden
          color: #999
        .count
          display flex
          align-items center
          justify-content center
          color #999
          .icon-subscription
            margin-right 4px
            font-size 15px
        .focus
          margin-top:20px
          width: 60px
          line-height: 26px
          background-color: #1f8bee
          color: #fff
          border:none
          outline: none
        .focus-s
          background-color: #bbb
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
