<template>
<div class="top">
  <div class="topBar">
    <div class="topLeft">
      <router-link class="logo" to="/index">
        <i class="icon-logo"></i>
      </router-link>
      <div class="search">
          <input v-model="query" type="text" name="search" @keyup.enter="toSearch">
          <i class="icon-search" @click="toSearch"></i>
      </div>
    </div>
    <div class="topRight">
      <div class="userInfo" v-if="isLogin()">
        <span class="username">{{nickname}}</span>
        <div class="header-user-down">
            <ul>
              <router-link tag="li" to="/user">我的主页</router-link>
              <li @click="showConfirm">退出登录</li>
            </ul>
            <div class="header-down-bg"></div>
        </div>
      </div>
      <router-link id="login" class="btn-login toptext" to="/login" v-if="!isLogin()">登录</router-link>
      <a class="contribute toptext" @click="contribute">投稿</a>
    </div>
  </div>
  <confirm @confirm="logout" text="确定要退出登陆吗 ？" ref="confirm"></confirm>
</div>
</template>

<script>
import Confirm from '../../components/confirm/confirm'
import {mapGetters, mapActions, mapMutations} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      query: ''
    }
  },
  computed: {
    nickname: function () {
      if (this.userInfo.data.nickname) {
        return this.userInfo.data.nickname
      } else if (this.userInfo.data.data) {
        return this.userInfo.data.data.nickname
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    isLogin () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        return true
      }
      return false
    },
    showConfirm () {
      if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
        this.$refs.confirm.show()
      }
    },
    logout () {
      this.saveUserInfo()
      this.$router.push({path: '/index'})
    },
    toSearch () {
      this.$router.push({path: `/search?${this.query}`})
      this.setSearchWord(this.query)
    },
    contribute () {
      window.open('/user/contribute')
    },
    ...mapActions([
      'saveUserInfo'
    ]),
    ...mapMutations({
      setSearchWord: 'SET_SEARCH_WORD'
    })
  },
  components: {
    'confirm': Confirm
  }
}
</script>

<style lang="stylus">
.top
  width: 100%
  min-width: 1050px
  z-index:100
  .topBar
    width: 1050px
    height: 60px
    margin: 0 auto
    display flex
    justify-content space-between
    align-items center
    .topLeft
      display flex
      justify-content space-between
      width: 770px
      .logo
        outline none
        .icon-logo
          font-size 26px
          color #393a4c
      .search
        display flex
        align-items center
        padding 0 10px
        border: 1px solid #919191
        border-radius: 4px
        input
          line-height: 28px
          height: 28px
          width: 150px
          border-radius: 4px
          font-size: 14px
          border none
          outline: none
          color:#393a4c
          background-color #f5f5f5
          &:focus + .icon-search
            color #1f8bee
        .icon-search
          font-size 26px
          color #919191
          cursor pointer
    .topRight
      display flex
      align-items center
      color #4c4d5f
      font-size: 14px
      .toptext
        padding 0 12px
        cursor: pointer
        &:hover
          color: #1f8bee
      .userInfo
        position relative
        cursor default
        .username
          display inline-block
          padding 0 12px
          &:hover + .header-user-down
            display: block
        .header-user-down
          display none
          z-index:10
          position: absolute
          top: 40px
          left: 50%
          margin-left -60px
          width 120px
          background-color #4c4d5f
          text-align: center
          color:#c4c4c4
          &:before
            content: ""
            position: absolute
            left: 0
            top: -18px
            width: 100%
            height: 18px
          &:hover
            display block
          .header-down-bg
            position: absolute
            width: 100%
            height: 6px
            top:-6px
            left: 0
            background:url(./header-down-bg.png) no-repeat center top
          li
            line-height 44px
            cursor: pointer
            &:hover
              color: #fff
      .btn-login
        outline none
        color #1f8bee
      .contribute
        border-left: 1px solid #ccc
</style>
