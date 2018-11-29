<template>
  <form id="formPersonal" class="commentForm">
    <div class="cer-info-wrapper" v-if="isCompany">
      <h3>主体信息</h3>
      <div class="cer-info-item">
          <span class="cer-info-name">企业或组织名称：</span>
          <input class="cer-info-input" type="text" v-model="companyName" v-validate="'required'" name="companyName">
          <span class="error" v-show="errors.has('companyName')">{{errors.first('companyName')}}</span>
      </div>
      <div class="cer-info-item">
          <span class="cer-info-name">营业执照注册号：</span>
          <input class="cer-info-input" type="text" v-model="companyId" v-validate="'required'" name="companyId">
          <span class="error" v-show="errors.has('companyId')">{{errors.first('companyId')}}</span>
      </div>
      <uploader title="营业执照扫描件" @file="getLicence"></uploader>
    </div>
    <div class="cer-info-wrapper">
      <h3>运营者信息</h3>
      <div class="cer-info-item">
          <span class="cer-info-name">身份证姓名：</span>
          <input class="cer-info-input" type="text" v-model="name" v-validate="'required'" name="name">
          <span class="error" v-show="errors.has('name')">{{errors.first('name')}}</span>
      </div>
      <div class="cer-info-item">
          <span class="cer-info-name">身份证号码：</span>
          <input class="cer-info-input" type="text" v-model="idCard" v-validate="'required|numeric|length:18'" name="idCard">
          <span class="error" v-show="errors.has('idCard')">{{errors.first('idCard')}}</span>
      </div>
      <uploader title="身份证正面" @file="getFront"></uploader>
      <uploader title="身份证反面" @file="getBehind"></uploader>
      <div class="cer-info-item">
          <span class="cer-info-name"></span>
          <label class="cer-info-clause">
              <input v-validate="'required'" id="agree" name="agree" type="checkbox" checked="checked">
              <span>我已阅读并接受<router-link to="/terms" target="_blank">《赛恩财经用户协议》</router-link></span>
          </label>
          <span class="error" v-show="errors.has('agree')">{{errors.first('agree')}}</span>
      </div>
    </div>
    <div class="cer-info-submit" v-show="!errors.any()">
        <div class="btn-submit" @click="toSubmit">提交</div>
        <p class="fileError" v-show="isError"><i class="icon-notice"></i><span>{{errorTips}}</span></p>
    </div>
  </form>
</template>

<script>
import Uploader from '../../base/img-uploader/img-uploader'
import {postFileApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      picIdCard: [
        {
          title: '身份证正面：',
          url: '',
          file: ''
        },
        {
          title: '身份证反面：',
          url: '',
          file: ''
        }
      ],
      companyName: '',
      companyId: '',
      licence: '',
      name: '',
      idCard: '',
      cardFront: '',
      cardBehind: '',
      isError: null,
      errorTips: ''
    }
  },
  props: {
    isCompany: {
      type: Boolean,
      default: true
    },
    cerType: {
      type: Number,
      default: null
    }
  },
  filters: {
    GetChinese (strValue) {
      if (strValue) {
        let reg = /[\u4e00-\u9fa5]/g
        return strValue.match(reg).join('')
      }
      return strValue
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    isFileError () {
      if (this.cerType === 1) {
        if (!this.cardFront || !this.cardBehind) {
          return false
        }
        return true
      }
      if (this.cerType === 2 || this.cerType === 3) {
        if (!this.cardFront || !this.cardBehind || !this.licence) {
          return false
        }
        return true
      }
    },
    toSubmit () {
      this.$validator.validateAll().then(res => {
        if (res) {
          if (this.isFileError()) {
            this.isError = false
            this.submit()
          } else {
            this.isError = true
            this.errorTips = '请重新上传图片'
          }
        }
      })
    },
    submit () {
      let params = new FormData()
      params.append('session', this.userInfo.data.session || this.userInfo.data.data.session)
      params.append('type', this.cerType)
      params.append('identification_card_name', this.name)
      params.append('identification_card_number', this.idCard)
      params.append('UserCertification[identification_card_front]', this.cardFront)
      params.append('UserCertification[identification_card_back]', this.cardBehind)
      params.append('company_name', this.companyName)
      params.append('business_number', this.companyId)
      params.append('UserCertification[business_licences_picture]', this.licence)
      postFileApi('user.submitCertificate', params).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.$emit('submit')
        } else {
          this.isError = true
          this.errorTips = res.data.errorMessage.business_number
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getFront (val) {
      this.cardFront = val
    },
    getBehind (val) {
      this.cardBehind = val
    },
    getLicence (val) {
      this.licence = val
    }
  },
  components: {
    'uploader': Uploader
  }
}
</script>

<style lang="stylus">
.cer-info-form
  padding-bottom 70px
  .cer-info-wrapper
    h3
      line-height: 40px
      font-size: 16px
      border-bottom: 1px solid #ccc
      color: #4c4d5f
    .cer-info-item
      position: relative
      display: flex
      margin 36px 0
      color: #888
      .error
        position: absolute
        left: 150px
        bottom: -24px
        line-height 14px
        color #f00
      .cer-info-name
        width: 150px
        line-height: 40px
        height: 40px
      .cer-info-input
        width: 580px
        border: 1px solid #d9d9d9
        border-radius: 2px
        text-indent: 12px
        outline none
        &:hover
          border-color: #1f8bee
        &:focus
          border-color: #1f8bee
      .cer-info-clause
        display flex
        align-items center
        line-height 0
        input
          width: 14px
          height: 14px
        span
          margin-left: 6px
          a
            color: #1f8bee
  .cer-info-submit
    position relative
    padding-top 40px
    border-top: 1px solid #ccc
    text-align: center
    .btn-submit
      margin 0 auto
      width: 100px
      height: 32px
      line-height: 32px
      font-size: 15px
      border:none
      border-radius: 2px
      background-color: #1f8bee
      color: #fff
      cursor: pointer
      &:hover
        background-color: #2e9aff
        cursor pointer
    .fileError
      display flex
      align-items center
      position absolute
      left 0
      top 10px
      color #ff0000
      .icon-notice
        margin-right 4px
        font-size 18px
</style>
