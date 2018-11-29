<template>
<div id="index">
  <digiccy></digiccy>
  <scroll-news :scrollNews="scrollNews" v-if="scrollNews.length"></scroll-news>
  <div class="main">
    <div class="mainBox">
      <div class="toutiao-wrapper">
        <div class="toutiao-left">
          <t-news :tNews="tNews" v-if="tNews.length" :maxLen="2"></t-news>
          <slide-news :slideNews="slideNews" v-if="slideNews.length"></slide-news>
          <list-news :listNews="listNews" v-if="listNews.length"></list-news>
        </div>
        <div class="toutiao-right">
          <charts-box></charts-box>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="columnBox">
        <div class="col-box-left">
          <news-page></news-page>
        </div>
        <div class="col-box-right">
          <div class="news-flash">
            <div class="block-title"><span>实时快讯</span></div>
            <iframe frameborder="0" width="230" height="600" scrolling="yes" src="https://www.jin10.com/example/jin10.com.html?messageNum=50&amp;fontSize=14px&amp;backgroundColor=f8f8f8&amp;color=393a4c"></iframe>
          </div>
          <div class="author-list" v-if="authorList.length">
            <div class="block-title"><span>专栏作者</span></div>
            <author-list :authorList="authorList"></author-list>
          </div>
          <div class="news-recommend" v-if="recommendNews.length">
            <div class="block-title"><span>推荐阅读</span></div>
            <news-recommend :recommendNews="recommendNews"></news-recommend>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import Digiccy from '../../components/digiccy-scroll/digiccy-scroll'
import ScrollNews from '../../components/scrollNews/scrollNews.vue'
import SlideNews from '../../components/slideNews/slideNews.vue'
import TNews from '../../components/tNews/tNews.vue'
import ListNews from '../../components/listNews/listNews.vue'
import NewsPage from '../../components/newsPage/newsPage.vue'
import NewsRecommend from '../../components/news-recommend/news-recommend.vue'
import AuthorList from '../../components/author-list/author-list'
import ChartsBox from '../../components/charts-box/charts-box.vue'
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
export default {
  components: {
    'digiccy': Digiccy,
    'scroll-news': ScrollNews,
    'slide-news': SlideNews,
    't-news': TNews,
    'list-news': ListNews,
    'news-page': NewsPage,
    'news-recommend': NewsRecommend,
    'charts-box': ChartsBox,
    'author-list': AuthorList
  },
  data () {
    return {
      scrollNews: [],
      slideNews: [],
      tNews: [],
      listNews: [],
      authorList: [],
      recommendNews: []
    }
  },
  created () {
    this.httpGet()
  },
  methods: {
    httpGet () {
      postApi('web.getIndexHeader').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.tNews = res.data.data.headArray
          this.listNews = res.data.data.headRecommendArray
          this.slideNews = res.data.data.flagSlideArray
          this.scrollNews = res.data.data.flagRollArticle
          let authorColumn1 = res.data.data.userArray.slice(0, 2)
          let authorColumn2 = res.data.data.userArray.slice(2, 4)
          let authorColumn3 = res.data.data.userArray.slice(4, 5)
          this.authorList = [
            { column: authorColumn1 },
            { column: authorColumn2 },
            { column: authorColumn3 }
          ]
          console.log(res.data.data.userArray)
        }
      })
      postApi('web.getSpecialRecommend', {
        count: 5
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.recommendNews = res.data.data.specialArray
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.main
  width: 100%
  min-width: 1050px
  .mainBox
    width: 1050px
    margin: 0 auto
    .toutiao-wrapper
      overflow: hidden
      .toutiao-left
        float: left
        width: 770px
      .toutiao-right
        float: right
        width: 230px
    .columnBox
      overflow: hidden
      .col-box-left
        float: left
        width: 770px
      .col-box-right
        float: right
        width: 230px
        .news-flash, .author-list, .news-recommend
          margin-bottom 30px
          .block-title
            border-bottom:1px solid #ccc
            margin-bottom: 18px
            span
              display: inline-block
              font-size: 18px
              line-height: 32px
              color: #393a4c
              border-bottom: 2px solid #1f8bee
              font-weight: bold

</style>
