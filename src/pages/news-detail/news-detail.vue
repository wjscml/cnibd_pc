<template>
  <div class="main" v-wechat-title="newsDetails.title">
    <div class="news-detail">
        <div class="news-detail-left">
            <div class="news-detail-wrap" v-show="newsDetails.content">
                <div class="detail-header">
                    <h1 class="title-box">{{newsDetails.title}}</h1>
                    <div class="issue-box">
                        <router-link :to="`/author/${newsDetails.author_id}`" tag="p" class="author">
                            <img :src="newsDetails.author_avatar" width="24" height="24">
                            <a class="name">{{newsDetails.author_name}}</a>
                        </router-link>
                        <p class="time">发布时间：<span>{{newsDetails.publish_time}}</span></p>
                        <p class="collect" @click="toggleFavorite">
                          <i :class="!newsDetails.isKeep ? 'icon-favor' : 'icon-favor_fill'"></i>
                          <span v-show="!newsDetails.isKeep" class="tips-favor">收藏</span>
                          <span v-show="newsDetails.isKeep" class="tips-favor_fill">已收藏</span>
                        </p>
                        <p class="read-number">
                          <i class="icon-hot_fill"></i>
                          <span>{{newsDetails.scan_count}}</span>
                        </p>
                    </div>
                </div>
                <div class="detail-text" v-html="newsDetails.content"></div>
                <div class="source">
                  <div class="source-text">
                      <p>本文来源：<span>{{newsDetails.author_name}}</span></p>
                      <p class="keyword">关键字：<span></span></p>
                      <!--<p><span>责任编辑：Jerry</span></p>-->
                  </div>
                  <div class="share" id="share">
                      <span>分享：</span>
                      <div class="bdsharebuttonbox">
                          <a :href="`http://service.weibo.com/share/share.php?appkey=&title=${newsDetails.title}&url=https://www.cnibd.com/site/${this.$route.params.id}&pic=${newsDetails.thumb}`" target="_blank" class="bds_tsina" title="分享到新浪微博"></a>
                          <a :href="`https://connect.qq.com/widget/shareqq/index.html?url=https://www.cnibd.com/site/${this.$route.params.id}&title=${newsDetails.title}&source=${newsDetails.title}&desc=${newsDetails.summary}&pics=${newsDetails.thumb}`" target="_blank" class="bds_sqq" title="分享到QQ好友"></a>
                          <a @mouseover="showQRCode" @mouseout="hideQRCode" class="bds_weixin" title="分享到微信"></a>
                      </div>
                  </div>
                </div>
                <div class="page">
                    <p class="page-item">
                      <span>上一篇：</span>
                      <span v-if="beforeArticle.title" @click="golast" class="title">{{beforeArticle.title}}</span>
                      <span v-if="!beforeArticle.title" class="tips">已经是第一篇文章啦~</span>
                    </p>
                    <p class="page-item">
                      <span>下一篇：</span>
                      <span v-if="afterArticle.title" @click="gonext" class="title">{{afterArticle.title}}</span>
                      <span v-if="!afterArticle.title" class="tips">已经是最后一篇文章啦~</span>
                    </p>
                </div>
                <transition name="QRCode">
                  <div class="wx-sharebox" v-show="isQRCode">
                    <div class="wx-share-title">分享到微信</div>
                    <qrcode class="wx-share-img" :value="`https://h5.cnibd.com/site/${this.$route.params.id}`" :size="200"></qrcode>
                    <div class="wx-share-text">打开微信，使用“扫一扫”即可分享本文</div>
                  </div>
                </transition>
            </div>
            <loading class="loading-wrapper" v-show="!newsDetails.content"></loading>
        </div>
        <div class="news-detail-right">
          <div class="news-ranking" v-if="rankingNews.length">
            <div class="block-title"><span>新闻排行</span></div>
            <news-ranking :rankingNews="rankingNews" :num=10></news-ranking>
          </div>
          <div class="news-recommend" v-if="recommendNews.length">
            <div class="block-title"><span>推荐阅读</span></div>
            <news-recommend :recommendNews="recommendNews"></news-recommend>
          </div>
        </div>
    </div>
    <div class="fixed-tool" v-show="isShow">
      <a href="#top" class="btn-goTop"><i class="icon-top"></i></a>
    </div>
    <confirm @confirm="goLogin" text="登录后方可收藏本文~" confirmBtnText="去登录" ref="confirm"></confirm>
  </div>
</template>
<script>
import Qrcode from 'qrcode.vue'
import NewsRecommend from '../../components/news-recommend/news-recommend.vue'
import NewsRanking from '../../components/news-ranking/news-ranking.vue'
import Loading from '../../components/loading/loading.vue'
import Confirm from '../../components/confirm/confirm'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      recommendNews: [],
      rankingNews: [],
      newsDetails: [],
      afterArticle: [],
      beforeArticle: [],
      isQRCode: false,
      isShow: null
    }
  },
  created () {
    this.httpGet()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted () {
    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll)
    }, 20)
  },
  methods: {
    handleScroll () {
      this.isShow = false
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var h = document.documentElement.clientHeight
      if (scrollTop < h) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    httpGet () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        this.params = {
          articleId: this.$route.params.id,
          session: this.userInfo.data.session || this.userInfo.data.data.session
        }
        this.getDetail()
      } else {
        this.params = {
          articleId: this.$route.params.id
        }
        this.getDetail()
      }
      this.getRecommend()
    },
    getDetail () {
      postApi('article.getDetail', this.params).then(res => {
        // console.log(window.location.pathname)
        if (res.data.errorCode === ERR_OK) {
          this.newsDetails = res.data.data
          this.afterArticle = this.newsDetails.article_after
          this.beforeArticle = this.newsDetails.article_before
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
        count: 5
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.recommendNews = res.data.data.specialArray
        }
      })
    },
    gotop () {
      this.$refs.article.scrollIntoView()
    },
    gonext () {
      if (this.newsDetails.article_after.length === 0) {
        alert('已经是最后一篇文章啦~')
      } else {
        this.$router.push({path: `/site/${this.newsDetails.article_after.id}`})
      }
    },
    golast () {
      if (this.newsDetails.article_before.length === 0) {
        alert('已经是第一篇文章啦~')
      } else {
        this.$router.push(`/site/${this.newsDetails.article_before.id}`)
      }
    },
    toggleFavorite () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        postApi('article.keep', {
          session: this.userInfo.data.session || this.userInfo.data.data.session,
          articleId: this.$route.params.id
        }).then(res => {
          if (res.data.errorCode === ERR_OK) {
            if (res.data.data.action === 1) {
              this.newsDetails.isKeep = 1
            }
            if (res.data.data.action === 2) {
              this.newsDetails.isKeep = 0
            }
          }
        })
      } else {
        this.$refs.confirm.show()
      }
    },
    goLogin () {
      this.$router.push('/login')
    },
    showQRCode () {
      this.isQRCode = true
    },
    hideQRCode () {
      this.isQRCode = false
    }
  },
  watch: {
    '$route' (to, from) {
      this.httpGet()
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  components: {
    'loading': Loading,
    'confirm': Confirm,
    'news-recommend': NewsRecommend,
    'news-ranking': NewsRanking,
    'qrcode': Qrcode
  }
}
</script>

<style lang="stylus">
.main
  width: 100%
  min-width: 1050px
  margin-top: 24px
  margin-bottom 48px
  .news-detail
    width: 1050px
    margin: 0 auto
    overflow: hidden
    .news-detail-left
      position: relative
      float: left
      width: 732px
      .news-detail-wrap
        padding:18px 0
        .detail-header
          .title-box
            font-size: 28px
            line-height: 38px
            font-weight: 600
            color: #393a4c
          .issue-box
            display flex
            align-items center
            justify-content space-between
            overflow: hidden
            margin-top: 20px
            border-bottom: 1px solid #e0e0e0
            height: 40px
            font-size: 14px
            color: #999
            .author
              display flex
              align-items center
              margin-right 30px
              cursor pointer
              &:hover
                .name
                  color #1f8bee
              img
                margin-right 6px
                border-radius 50%
                width 24px
                height 24px
              .name
                outline none
                color #999
            .time
            .collect
              display flex
              align-items center
              margin-right 30px
              cursor pointer
              .icon-favor,.icon-favor_fill
                margin-right 4px
                font-size 18px
                color #1f8bee
              .tips-favor
                &:hover
                  color #1f8bee
              .tips-favor_fill
                color #1f8bee
            .read-number
              display flex
              align-items center
              .icon-hot_fill
                margin-right 4px
                font-size 18px
                color #f03752
        .detail-text
          margin: 24px 0
          p
            font-size: 16px
            line-height: 32px
            color: #363636
            margin-bottom: 14px
          h2,h3,h4,h5
            margin-bottom: 20px
            font-size: 20px
            font-weight: 600
        .source
          overflow: hidden
          line-height: 30px
          font-size: 14px
          color: #999
          .source-text
            float: left
            p
              float: left
              margin-right:24px
          .share
            float: right
            font-size: 0
            span
              vertical-align: top
              font-size: 14px
            .bdsharebuttonbox
              display: inline-block
              a
                display: inline-block
                width: 30px
                height: 30px
                padding-left: 0px
                margin:0 0 0 8px
                background:url(shareBg.png) no-repeat
                background-size:90px 150px
                cursor: pointer
                &.bds_weixin
                  background-position: left top
                  &:hover
                    background-position: right top
                &.bds_sqq
                  background-position: left center
                  &:hover
                    background-position: right center
                &.bds_tsina
                  background-position: left bottom
                  &:hover
                    background-position: right bottom
        .page
          margin-top:48px
          font-size: 16px
          .page-item
            display flex
            margin-bottom 12px
            line-height 32px
            font-weight 600
            color: #757575
            .title
              flex 1
              margin-left 4px
              cursor pointer
              &:hover
                color: #1f8bee
            .tips
              font-weight normal
              color #999
        .wx-sharebox
          position: absolute
          right: 0
          bottom: 200px
          padding: 10px 0
          background-color: #f8f8f8
          border:1px solid #d9d9d9
          .wx-share-img
            padding: 10px 30px
          .wx-share-title
            line-height: 30px
            font-size: 16px
            text-align: center
            color: #393a4c
          .wx-share-text
            line-height: 24px
            font-size: 14px
            text-align: center
            color: #999
          &.QRCode-enter-active,.QRCode-leave-active
            transition all .5s ease
          &.QRCode-enter, &.QRCode-leave-active
            opacity 0
      .loading-wrapper
        margin-top 140px
    .news-detail-right
      float: right
      width: 226px
      padding-top:18px
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
  .fixed-tool
    position: fixed
    right: 50px
    bottom: 120px
    .btn-goTop
      display block
      width 48px
      height 48px
      border-radius 50%
      outline none
      background-color #ccc
      text-align center
      .icon-top
        color #fff
        font-size 24px
        line-height 48px
      &:hover
        background-color: #1f8bee
        transition-duration: .4s
</style>
