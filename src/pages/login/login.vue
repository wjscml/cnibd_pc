<template>
<div class="main">
  <div class="mainBox">
      <form class="common-wrapper" ref="loginForm">
          <div class="tips-wrapper" v-show="loginTips" ref="tipsWrapper">
            <p class="tips">{{loginTips}}</p>
          </div>
          <h2>
              <span>登录</span>
              <router-link to="/register" class="link">立即注册</router-link>
          </h2>
          <div class="common-item ">
              <div class="input-content" :class="{'error': errors.has('username')}">
                  <input v-model="tel" v-validate="'required|numeric|length:11'" name="username" class="userName" placeholder="请输入手机号" type="text">
              </div>
              <span class="common-error-tips" v-show="errors.has('username')">{{errors.first('username')}}</span>
          </div>
          <div class="common-item ">
              <div class="input-content" :class="{'error': errors.has('password')}">
                  <input v-model="password" v-validate="'required'" name="password" placeholder="请输入密码" type="password" @keyup.enter="login">
              </div>
              <span class="common-error-tips" v-show="errors.has('password')">{{errors.first('password')}}</span>
          </div>
          <div class="common-extra">
              <router-link to="/forget" class="forget-btn">忘记密码？</router-link>
          </div>
          <div class="submit" @click="login">登录</div>
      </form>
      <div class="third-party">
          <p class="third-party-text">微信登录</p>
          <div class="login-wx" @click="wxLogin"></div>
      </div>
  </div>
</div>
</template>

<script>
import {postApi} from '../../api/getApi'
import {mapActions, mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      tel: '',
      password: '',
      loginTips: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    if (this.userInfo && this.userInfo.errorCode === ERR_OK) {
      this.$router.back()
    }
  },
  methods: {
    ...mapActions([
      'saveUserInfo'
    ]),
    login () {
      this.$validator.validateAll().then(res => {
        this.loginTips = ''
        if (res) {
          let loginParam = {
            mobileNumber: this.tel,
            password: this.password
          }
          postApi('user.login', loginParam).then(res => {
            if (res.data.errorCode === ERR_OK) {
              this.saveUserInfo(res.data)
              this.$refs.tipsWrapper.style['background-color'] = '#04be02'
              this.loginTips = '成功登录！'
              if (window.history.length <= 1) {
                this.$router.push({path: '/index'})
                return false
              } else {
                this.$router.back()
              }
            } else {
              this.loginTips = res.data.errorMessage
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    wxLogin () {
      let pageUrl = encodeURIComponent('http://192.168.31.160:8080/wx_login')
      window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx70d395942c321a44&redirect_uri=' + pageUrl + '&response_type=code&scope=snsapi_login&state=2#wechat_redirect'
    }
  }
}
</script>

<style lang="stylus" scoped>
.main
  width: 100%
  min-width: 1000px
  .mainBox
    width: 1000px
    margin:0 auto
    overflow: hidden
    .common-wrapper
      position relative
      width: 344px
      margin: 70px auto
      .tips-wrapper
        position absolute
        top -60px
        left 0
        width 100%
        border-radius 2px
        background-color #f1403c
        .tips
          height 40px
          line-height 40px
          text-align center
          color #fff
      h2
        margin-bottom: 40px
        .link
          float: right
          line-height: 60px
          font-size: 16px
          color: #666
          &:hover
            color: #1f8bee
      .common-item
        margin-bottom:16px
        .input-content
          display: flex
          width: 342px
          font-size: 0
          border: 1px solid #d9d9d9
          border-radius: 2px
          background-color:#fff
          input
            flex 1
            padding:0 14px
            line-height: 40px
            height: 40px
            font-size: 14px
            border:none
            outline: none
          &.error
            border-color #f00
        .common-error-tips
          display: block
          line-height: 24px
          height: 24px
          text-align: right
          color: red
      .common-extra
        overflow: hidden
        margin:24px 0 14px 0
        .forget-btn
          float: right
          line-height: 14px
          color: #666
          &:hover
            color:#2e9aff
      .submit
        line-height 44px
        height 44px
        width 344px
        font-size 16px
        border-radius 2px
        border none
        text-align center
        color #fff
        background-color #1f8bee
        cursor pointer
    .third-party
      font-size: 0
      margin-bottom: 70px
      padding-top: 40px
      border-top: 1px dashed #d9d9d9
      .third-party-text
        height: 16px
        line-height: 16px
        font-size: 16px
        text-align: center
        margin-bottom: 32px
      .login-wx
        display: block
        width: 40px
        height: 40px
        margin: 0 auto
        background:url(./shareBg.png) no-repeat
        background-size: 120px 200px
        cursor pointer
        &.login-wx
          background-position:left top
        &.login-qq
          background-position:left center
        &.login-wb
          background-position:left bottom
        &.login-wx:hover
          background-position:right top
        &.login-qq:hover
          background-position:right center
        &.login-wb:hover
          background-position:right bottom
</style>
