<template>
  <div class="user-main">
    <div class="user-main-title">
        <span class="title">收藏的文章</span>
        <i class="icon-delete_all" v-if="false"></i>
    </div>
    <news-column :news="favoriteList" :isLoad="isLoad" :tips="tips" :hasHot="false" :hasCollect="true" @deleteCollect="showConfirm" @loadMore="loadMore" v-show="favoriteList.length"></news-column>
    <div class="no-result-wrapper" v-show="!favoriteList.length">
      <i class="icon-no_result"></i>
      <p>{{noResultDesc}}</p>
    </div>
    <confirm @confirm="deleteCollect" :text="confirmText" ref="confirm"></confirm>
  </div>
</template>
<script>
import NewsColumn from '../../components/newsColumn/newsColumn.vue'
import Confirm from '../../components/confirm/confirm'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      favoriteList: [],
      page: 0,
      isLoad: null,
      tips: '',
      confirmText: '是否不再收藏此文章',
      noResultDesc: '暂无收藏文章'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    this.getFavoriteArticle()
  },
  methods: {
    getFavoriteArticle () {
      postApi('article.getKeepList', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        page: this.page
      }).then(res => {
        console.log(res)
        if (res.data && res.data.errorCode === ERR_OK) {
          this.favoriteList = res.data.data.publishArticles
          this.tips = '点击加载更多'
        }
      })
    },
    loadMore () {
      this.tips = '加载中...'
      this.isLoad = true
      this.page++
      postApi('article.getKeepList', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        page: this.page
      }).then((res) => {
        this.isLoad = false
        if (res.data && res.data.errorCode === ERR_OK) {
          this.favoriteList = this.favoriteList.concat(res.data.data.publishArticles)
          this.tips = '点击加载更多'
        } else {
          this.tips = '没有更多数据了'
        }
      }).catch(error => {
        if (!error.res) {
          this.isLoad = false
          this.tips = '网络不给力，请稍后尝试'
        }
      })
    },
    showConfirm (item) {
      this.articleId = item.id
      this.n = item.index
      this.$refs.confirm.show()
    },
    deleteCollect () {
      postApi('article.keep', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        articleId: this.articleId
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.favoriteList = this.favoriteList.slice(0, this.n).concat(this.favoriteList.slice(this.n + 1))
          this.getFavoriteArticle()
        }
      })
    }
  },
  components: {
    'news-column': NewsColumn,
    'confirm': Confirm
  }
}
</script>
<style lang="stylus">
.user-main
  margin-bottom 40px
  .no-result-wrapper
    margin-top 140px
    text-align center
    color #757575
    .icon-no_result
      font-size 120px
      color #bfbfbf
</style>
