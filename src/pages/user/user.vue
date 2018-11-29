<template>
  <div class="main">
    <div class="userBox">
      <div class="user-nav">
        <div class="user-avatar" :class="isCertificate">
          <img :src="avatar">
        </div>
        <router-link tag="div" :to="item.path" v-for="(item, index) in nav" :key="index" class="nav-name" active-class="nav-name-c">
          {{item.title}}
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      nav: [
        {
          title: '基本资料',
          path: '/user/center'
        },
        {
          title: '收藏列表',
          path: '/user/collect'
        },
        {
          title: '关注列表',
          path: '/user/focus'
        },
        {
          title: '实名认证',
          path: '/user/certification'
        },
        {
          title: '我的文章',
          path: '/user/article'
        }
      ],
      code_certificate: Number
    }
  },
  computed: {
    isCertificate () {
      if (this.userInfo.data.isCertificate || (this.userInfo.data.data && this.userInfo.data.data.isCertificate === 1)) {
        return 'vip'
      }
      return ''
    },
    avatar () {
      if (this.userInfo.data.data && this.userInfo.data.data.avatar) {
        return this.userInfo.data.data.avatar
      }
      return this.userInfo.data.avatar
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    if (!this.userInfo || this.userInfo.errorCode !== ERR_OK) {
      this.$router.push('/login')
      alert('☺请先登录吖')
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/vip'
.userBox
  width: 1050px
  margin: 48px auto 0 auto
  overflow: hidden
  .user-nav
    float: left
    width: 140px
    .user-avatar
      margin 0 0 20px 20px
      width: 100px
      height: 100px
      background-color: #f8f8f8
      &.vip
        vip(24px, url(../../common/image/vip-steps.png))
      img
        width: 98px
        height: 98px
        border-radius: 50px
        border:1px solid #fffc00
    .nav-name
      margin-top: 2px
      line-height: 42px
      font-size: 14px
      text-align: center
      background-color: #ebebeb
      color: #4c4d5f
      cursor: pointer
      &:hover
        color: #fff
        background-color: #1f8bee
    .nav-name-c
      color: #fff
      background-color: #1f8bee
  .user-main
    float: right
    width: 732px
    padding:0 20px
    background-color: #f8f8f8
    .user-main-title
      border-bottom: 1px solid #ccc
      display flex
      align-items center
      justify-content space-between
      height 40px
      .title
        display: block
        font-size: 16px
        color: #4c4d5f
      .title-nav
        line-height 38px
        font-size: 16px
        color: #4c4d5f
        cursor pointer
        &.title-nav-c
          border-bottom 2px solid #1f8bee
          color: #1f8bee
      .icon-delete_all
        font-size 18px
        color #a8a8a8
        cursor pointer
        &:hover
          color #f00
</style>
