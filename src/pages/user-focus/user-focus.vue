<template>
  <div class="user-main">
    <div class="user-main-title">
        <span class="title">关注的作者</span>
    </div>
    <div class="focus-wrapper">
      <div class="author-column" v-for="(column, index) in favoriteColumnist" :key="index">
        <router-link :to="`/author/${column.author_id}`" tag="div" class="author-item">
          <div class="image" :class="{'vip': column.is_certificate}">
            <img :src="column.avatar">
          </div>
          <h1 class="name">{{column.nickname}}</h1>
          <p class="description"><span>{{column.description | none}}</span></p>
          <i class="icon-delete" @click.stop="showConfirm(column, index)"></i>
        </router-link>
      </div>
      <div class="author-column">
        <loading v-show="isLoad"></loading>
      </div>
    </div>
    <div class="focus-no-result-wrapper" v-show="!favoriteColumnist.length">
      <i class="icon-no_result"></i>
      <p>{{noResultDesc}}</p>
    </div>
    <confirm @confirm="deleteCollect" :text="confirmText" ref="confirm"></confirm>
  </div>
</template>
<script>
import Confirm from '../../components/confirm/confirm'
import Loading from '../../components/loading/loading'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      favoriteColumnist: [],
      page: 0,
      isLoad: null,
      confirmText: '',
      noResultDesc: '暂无关注作者'
    }
  },
  filters: {
    none: function (value) {
      if (!value) return '作者忙得飞起，忘了介绍自己'
      return value
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  created () {
    this.getFavoriteColumnist()
  },
  methods: {
    getFavoriteColumnist () {
      postApi('user.getFollowAuthorList', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        page: 0
      }).then(res => {
        if (res.data && res.data.errorCode === ERR_OK) {
          this.favoriteColumnist = res.data.data
        }
      })
    },
    loadMore () {
      this.isLoad = true
      this.page++
      postApi('user.getFollowAuthorList', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        page: this.page
      }).then((res) => {
        this.isLoad = false
        if (res.data && res.data.errorCode === ERR_OK) {
          this.favoriteColumnist = this.favoriteColumnist.concat(res.data.data)
        }
      }).catch(error => {
        if (!error.res) {
          this.isLoad = false
        }
      })
    },
    showConfirm (column, index) {
      this.confirmText = `是否不再关注 "${column.nickname}"`
      this.followUserId = column.author_id
      this.n = index
      this.$refs.confirm.show()
    },
    deleteCollect () {
      postApi('user.follow', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        followUserId: this.followUserId
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.favoriteColumnist = this.favoriteColumnist.slice(0, this.n).concat(this.favoriteColumnist.slice(this.n + 1))
        }
      })
    },
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop + windowHeight === scrollHeight) {
        this.loadMore()
      }
    }
  },
  components: {
    'confirm': Confirm,
    'loading': Loading
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/vip"
.user-main
  .focus-wrapper
    overflow hidden
    margin-bottom 60px
    .author-column
      float left
      margin 80px 11px 0 11px
      width 222px
      &:hover
        .author-item
          border: 1px solid #fffc00
      .author-item
        position: relative
        border-radius 2px
        border: 1px solid #e0e0e0
        background-color #fff
        cursor pointer
        .vip
          vip(22px, url(../../common/image/vip-steps.png))
        .image
          position: absolute
          top: -35px
          left: 76px
          img
            width 70px
            height 70px
            border-radius 50%
            box-sizing border-box
            box-shadow: 0 0 5px #fffc00
        .name
          margin-top: 52px
          line-height: 18px
          font-size: 18px
          font-weight 600
          text-align: center
          color: #393a4c
        .description
          display flex
          align-items center
          justify-content center
          margin: 20px 18px 30px 18px
          height 40px
          text-align center
          color: #999
          span
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            overflow: hidden
        .icon-delete
          position absolute
          right 0
          top -35px
          font-size 20px
          color #e0e0e0
          &:hover
            color #f00
  .focus-no-result-wrapper
    text-align center
    color #757575
    .icon-no_result
      font-size 120px
      color #bfbfbf
</style>
