<template>
  <div class="user-main">
      <div class="user-main-content">
          <div class="user-main-title">
              <span class="title">基本资料</span>
          </div>
          <form class="personal-information" enctype="multipart/form-data">
              <div class="avatar-submit">
                <div class="avatar">
                  <img :src="avatar">
                  <div class="hover">
                      <span>修改头像</span>
                      <input class="file" v-validate="'image|size:1024'" data-vv-as="file" name="image_field" type="file" accept="image/png,image/gif,image/jpeg" @change="uploading($event)">
                  </div>
                </div>
                <div class="error" v-show="errors.has('image_field')">{{errors.first('image_field')}}</div>
              </div>
              <div class="item user-nickname">
                  <span class="item-name">昵称：</span>
                  <input v-model="nickname" type="text" class="personal-input" id="nickname">
              </div>
              <div class="item user-sex">
                  <span class="item-name">性别：</span>
                  <label for="man"><input type="radio" v-model="sex" id="man" name="sex" value="1" :checked="!checkSex"><span>男</span></label>
                  <label for="woman"><input type="radio" v-model="sex" id="woman" name="sex" value="2" :checked="checkSex"><span>女</span></label>
              </div>
              <div class="item user-intro">
                  <span class="item-name">简介：</span>
                  <textarea v-model="txt" v-validate="'min:6'" name="description" type="text" class="personal-input" maxlength="100" placeholder="请编辑您的个人简介（不要超过100字）" rows="3" style="resize:none"></textarea>
                  <p class="wordwrap"><span class="word">{{100 - charLen}}</span>/100</p>
                  <div class="error" v-show="errors.has('description')">{{errors.first('description')}}</div>
              </div>
              <div class="user-submit" @click="submit" v-show="!errors.any()">修改</div>
          </form>
      </div>
      <confirm :hasCancel="false" text="修改成功！" cancelBtnText="关闭" ref="confirm"></confirm>
  </div>
</template>
<script>
import Confirm from '../../components/confirm/confirm'
import {postFileApi} from '../../api/getApi'
import {mapGetters, mapActions} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      nickname: '',
      avatar: '',
      sex: '',
      txt: '',
      errorTips: '',
      file: ''
    }
  },
  computed: {
    checkSex () {
      if (this.userInfo.data.data && this.userInfo.data.data.sex) {
        return Math.abs(1 - this.userInfo.data.data.sex)
      }
      return Math.abs(1 - this.userInfo.data.sex)
    },
    charLen () {
      if (this.txt) {
        return this.txt.length
      } else {
        return 0
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    if (this.userInfo.data.data && this.userInfo.data.data.nickname) {
      this.nickname = this.userInfo.data.data.nickname
      this.avatar = this.userInfo.data.data.avatar
      this.sex = this.userInfo.data.data.sex
      this.txt = this.userInfo.data.data.description
    } else {
      this.nickname = this.userInfo.data.nickname
      this.avatar = this.userInfo.data.avatar
      this.sex = this.userInfo.data.sex
      this.txt = this.userInfo.data.description
    }
  },
  methods: {
    ...mapActions([
      'saveUserInfo'
    ]),
    uploading ($event) {
      this.file = event.target.files[0]
      this.avatar = this.getObjectURL(this.file)
    },
    submit () {
      if (!this.txt) {
        this.txt = '作者忙得飞起，忘了介绍自己'
      }
      this.$validator.validateAll().then(res => {
        if (res) {
          let userParam = new FormData()
          userParam.append('session', this.userInfo.data.session || this.userInfo.data.data.session)
          userParam.append('nickname', this.nickname)
          userParam.append('sex', this.sex)
          userParam.append('description', this.txt)
          userParam.append('User[avatar]', this.file)
          postFileApi('user.changeUserInfo', userParam).then(res => {
            if (res.data.errorCode === ERR_OK) {
              let userInfo = res.data
              userInfo.data.session = this.userInfo.data.session || this.userInfo.data.data.session
              userInfo.data.isCertificate = this.userInfo.data.isCertificate || this.userInfo.data.data.isCertificate
              this.saveUserInfo(userInfo)
              this.$refs.confirm.show()
            } else {
              this.errorTips = res.data.errorMessage.certification_description
              console.log(res)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  },
  components: {
    'confirm': Confirm
  }
}
</script>
<style lang="stylus">
.personal-information
  width: 732px
  .avatar-submit
    display flex
    flex-direction column
    align-items center
    .avatar
      position: relative
      margin-top 40px
      &:hover
        .hover
          display: block
      img
        width: 120px
        height: 120px
        border-radius: 60px
      .hover
        display: none
        position: absolute
        left: 0
        top: 0
        background:rgba(0,0,0,0.5)
        border-radius: 50%
        span
          display: block
          color: #fff
          line-height: 120px
          width: 120px
          text-align: center
          font-size: 14px
        input
          display block
          position absolute
          left 0
          top 0
          width 120px
          height 120px
          border-radius: 50%
          cursor: pointer
          opacity 0
    .error
      margin-top 20px
      color #ff0000
  .item
    color: #888
    margin: 24px 0
    font-size: 0
    .item-name
      display: inline-block
      font-size: 14px
      line-height: 40px
      height: 40px
      width: 50px
      text-align: left
    .personal-input
      box-sizing: border-box
      width: 682px
      padding:0 12px
      line-height: 38px!important
      border:1px solid #d9d9d9
      border-radius: 2px
      color: #393a4c
      font-size: 14px
    &.user-sex
      label
        margin-right: 40px
        input
          height 40px
          margin-left 14px
          vertical-align top
        span
          display inline-block
          margin-left 10px
          line-height 40px
          font-size 14px
          color: #393a4c
    &.user-intro
      position: relative
      .item-name
        vertical-align: top
      .wordwrap
        position: absolute
        right: 12px
        bottom: 6px
        font-size: 14px
        .word
          color #ff0000
          font-style: normal
      .error
        position: absolute
        left: 62px
        bottom: 6px
        font-size 14px
        color #ff0000
  .user-submit
    display: block
    margin:50px auto
    width: 100px
    height: 32px
    line-height: 32px!important
    font-size: 15px
    border:none
    border-radius: 2px
    background-color: #1f8bee
    text-align center
    color: #fff
    &:hover
      background-color: #2e9aff
      cursor pointer
</style>
