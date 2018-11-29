<template>
  <div class="main">
    <div class="mainBox">
        <form class="common-wrapper" >
            <div class="tips-wrapper" v-show="registerTips" ref="tipsWrapper" :class="{'correct': isCorrect}">
              <p class="tips">{{registerTips}}</p>
            </div>
            <h2>
                <span>注册</span>
                <router-link to="/login" class="link">已有账号登录</router-link>
            </h2>
            <div class="common-item ">
                <div class="input-content" :class="{'error': errors.has('username')}">
                    <input v-model="tel" v-validate="'required|numeric|length:11'" name="username" class="userName" placeholder="请输入手机号" type="text" ref="telWrapper">
                </div>
                <span class="common-error-tips" v-show="errors.has('username')">{{errors.first('username')}}</span>
            </div>
            <div class="common-item ">
                <div class="input-content" :class="{'error': errors.has('imgcode')}">
                    <input v-model="code" v-validate="'required|alpha|length:4'" name="imgcode" type="text" placeholder="请输入验证码" ref="codeWrapper">
                    <div class="line"></div>
                    <img class="imgCode" :src="captchaImage" @click="refreshCode">
                </div>
                <span class="common-error-tips" v-show="errors.has('imgcode')">{{errors.first('imgcode')}}</span>
            </div>
            <div class="common-item ">
                <div class="input-content" :class="{'error': errors.has('code')}">
                    <input v-model="mobileCode" v-validate="'required|numeric|length:4'" name="code" type="text" placeholder="请输入短信验证码"/>
                    <div class="line"></div>
                    <div class="send-code" v-show="!isSendCode && !isClick" @click="getMobileCode">{{sendText}}</div>
                    <div class="send-code" v-show="isClick"><loading title=""></loading></div>
                    <div class="send-code send-code-c" v-show="isSendCode">{{count}}s</div>
                </div>
                <span class="common-error-tips" v-show="errors.has('code')">{{errors.first('code')}}</span>
            </div>
            <div class="common-item ">
                <div class="input-content" :class="{'error': errors.has('password')}">
                    <input v-model="password" v-validate="'required|min:6|max:18'" name="password" type="password" placeholder="请输入密码" @keyup.enter="register">
                </div>
                <span class="common-error-tips" v-show="errors.has('password')">{{errors.first('password')}}</span>
            </div>
            <div class="agreement">
              <div class="agreement-content">
                <input v-validate="'required'" id="agreement" name="agreement" type="checkbox" checked="checked">
                <label for="agreement">我已阅读并同意 <a href="terms.html" target="_blank">用户协议</a></label>
              </div>
              <span class="common-error-tips" v-show="errors.has('agreement')">{{errors.first('agreement')}}</span>
            </div>
            <div class="submit" @click="register">注册</div>
        </form>
    </div>
  </div>
</template>

<script>
import Loading from '../../components/loading/loading'
import {postApi} from '../../api/getApi.js'
import {mapActions, mapGetters} from 'vuex'

const ERR_OK = '0'
const TIME_COUNT = 60
export default {
  data () {
    return {
      registerTips: '',
      tel: '',
      password: '',
      code: '',
      mobileCode: '',
      isTel: null,
      isPsw: null,
      isCode: null,
      isMobileCode: null,
      captchaImage: '',
      isClick: false,
      isSendCode: false,
      isCorrect: null,
      sendText: '发送验证码',
      count: ''
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
    } else {
      this.getCode()
    }
  },
  methods: {
    register () {
      this.$validator.validate().then(res => {
        this.registerTips = ''
        if (res) {
          this.toRegister()
        }
      })
    },
    toRegister () {
      let registerParam = {
        captchaCodeKey: this.captchaCodeKey,
        captchaCode: this.code,
        mobileNumber: this.tel,
        mobileCode: this.mobileCode,
        password: this.password
      }
      postApi('user.register', registerParam).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.saveUserInfo(res.data)
          this.isCorrect = true
          this.registerTips = '成功注册！'
          this.$router.push({path: '/index'})
        } else {
          this.registerTips = res.data.errorMessage
          this.isCorrect = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getCode () {
      postApi('user.getCaptcha').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.captchaImage = res.data.data.captchaImage
          this.captchaCodeKey = res.data.data.captchaCodeKey
        }
      }).catch(error => {
        console.log(error)
      })
    },
    refreshCode () {
      this.getCode()
    },
    getMobileCode () {
      this.isClick = true
      let params = {
        captchaCodeKey: this.captchaCodeKey,
        captchaCode: this.code,
        mobileNumber: this.tel,
        usage: 1
      }
      postApi('user.getMobileCode', params).then(res => {
        this.isClick = false
        if (res.data.errorCode === ERR_OK) {
          this.isSendCode = true
          this.registerTips = res.data.errorMessage
          this.isCorrect = true
          if (!this.timer) {
            this.count = TIME_COUNT
            this.isSendCode = true
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.isSendCode = false
                clearInterval(this.timer)
                this.timer = null
                this.sendText = '重新发送'
              }
            }, 1000)
          }
        } else {
          this.registerTips = res.data.errorMessage
          this.isCorrect = false
          this.refreshCode()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    ...mapActions([
      'saveUserInfo'
    ])
  },
  components: {
    'loading': Loading
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
      margin:70px auto
      .tips-wrapper
        position absolute
        top -60px
        left 0
        width 100%
        border-radius 2px
        background-color #f1403c
        &.correct
          background-color #04be02
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
          align-items center
          width: 342px
          height: 40px
          border: 1px solid #d9d9d9
          border-radius 2px
          background-color #fff
          font-size 0
          &.error
            border-color #f00
          .line
           width 1px
           height 36px
           background-color #d9d9d9
          .send-code
            width: 100px
            text-align: center
            font-size: 14px
            color: #333
            cursor: pointer
            &:hover
              color #1f8bee
          .imgCode
            width: 100px
            height: 36px
            border none
            outline none
          input
            flex 1
            padding:0 14px
            font-size: 14px
            background-color #fff
            border:none
            outline: none
        .common-error-tips
          display: block
          line-height: 24px
          height: 24px
          text-align: right
          color: red
      .agreement
        margin:24px 0 14px 0
        .agreement-content
          display flex
          align-items center
          font-size: 0
          input
            width: 14px
            height: 14px
            border: none
            outline: none
          label
            margin-left: 6px
            font-size: 14px
            color: #666
            a
              color: #1f8bee
        .common-error-tips
          display: block
          line-height: 24px
          height: 24px
          text-align: right
          color: red
      .submit
        display: block
        background-color:#1f8bee
        font-size:16px
        line-height:44px
        height: 44px
        width: 344px
        border-radius:2px
        border:none
        cursor pointer
        text-align center
        color:#fff
</style>
